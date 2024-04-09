const express = require("express");
const { Client } = require("pg");
const cors = require("cors");
const bodyParser = require("body-parser");

const connectionString =
  "postgres://kmbrorem:v5jNy5iD6ArmB4in6ZaRfqiiUHg4pbzs@isabelle.db.elephantsql.com/kmbrorem";

const client = new Client({
  connectionString: connectionString,
});

const app = express();
const port = process.env.PORT || 5000;

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json()); // for parsing application/json

app.use(cors());

app.post("/nx", async (req, res) => {
  console.log(req.body);
});

app.get("/", async (req, res) => {
  try {
    const tableNames = await fetchTableNames();
    res.send(tableNames);
  } catch (error) {
    res.status(500).send({ error: "Internal server error" });
  }
});

app.get("/:tableName", async (req, res) => {
  try {
    const tableName = req.params.tableName;
    const data = await returnAllDataAsJSON(tableName);
    res.send(data);
  } catch (error) {
    res.status(500).send({ error: "Internal server error" });
  }
});

app.post("/sqlquery", async (req, res) => {
  try {
    const query = req.body.query;
    const result = await client.query(`${query}`);

    res.send(result.rows);
  } catch (error) {
    res.status(500).send({ error: error.message });
  } finally {
    client.query("COMMIT");
  }
});

app.post("/add/:tableName", async (req, res) => {
  try {
    const data = req.body;
    const tableName = req.params.tableName;

    // if any  value is '[object Object]' then remove it
    for (const key in data) {
      if (data[key] === "[object Object]") {
        delete data[key];
      }
    }

    const values = Object.values(data)
      .map((value) => `'${value}'`)
      .join(", ");
    console.log(
      `INSERT INTO ${tableName} (${Object.keys(data).join(
        ", ",
      )}) VALUES (${values})`,
    );
    const result = await client.query(
      `INSERT INTO ${tableName} (${Object.keys(data).join(
        ", ",
      )}) VALUES (${values})`,
    );

    console.log(
      `INSERT INTO ${tableName} (${Object.keys(data).join(
        ", ",
      )}) VALUES (${values})`,
    );
    res.send(result.rows);
  } catch (error) {
    res.status(500).send({ error: error.message });
  } finally {
    client.query("COMMIT");
  }
});

app.get("/delete/:tableName/:id", async (req, res) => {
  try {
    const tableName = req.params.tableName;
    const id = req.params.id;
    const result = await client.query(
      `DELETE FROM ${tableName} WHERE id = ${id}`,
    );
    res.send(result.rows);
  } catch (error) {
    res.status(500).send({ error: error.message });
  } finally {
    client.query("COMMIT");
  }
});

app.post("/update/:tableName", async (req, res) => {
  try {
    const tableName = req.params.tableName;
    const data = req.body;

    const values = Object.entries(data)
      .map(([key, value]) => `${key} = '${value}'`)
      .join(", ");
    const result = await client.query(
      `UPDATE ${tableName} SET ${values} WHERE id = ${data.id}`,
    );
    res.send(result.rows);
  } catch (error) {
    res.status(500).send({ error: error.message });
  } finally {
    client.query("COMMIT");
  }
});

async function fetchTableNames() {
  try {
    const result = await client.query(
      "SELECT table_name FROM information_schema.tables WHERE table_schema = 'public';",
    );
    return result.rows.map((row) => row.table_name);
  } catch (error) {
    throw error;
  }
}

const RELATIONS = {
  tracks: ["albums", "genres", "media_types"],
  albums: ["artists"],
  films: ["film_actor", "film_category"],
  film_category: ["categories"],
  film_actor: ["actors"],
  customers: ["employees"],
  invoices: ["customers"],
  invoice_lines: ["invoices", "tracks"],
};

const RELATION_TYPES = {
  tracks: "INNER JOIN",
  albums: "INNER JOIN",
  films: "film_id",
  film_category: "category__id",
  file_actor: "actor__id",
  customers: "support_rep_id,id",
  invoices: "customer_id,id",
  invoice_lines: "track_id,id:invoice_id,id",
};

async function returnAllDataAsJSON(tableName) {
  try {
    if (RELATIONS[tableName]) {
      return await fetchRelatedData(tableName);
    } else {
      return await fetchTableData(tableName);
    }
  } catch (error) {
    throw error;
  }
}

async function fetchTableData(tableName) {
  try {
    const result = await client.query(`SELECT * FROM ${tableName}`);
    return result.rows;
  } catch (error) {
    throw error;
  }
}

async function fetchRelatedData(tableName) {
  try {
    if (!RELATIONS[tableName]) {
      throw new Error("Table does not have any related tables");
    }

    if (!(getRelationType(tableName) === "INNER JOIN")) {
      return await fetchRelatedDataWithID(tableName);
    } else {
      const relatedTables = RELATIONS[tableName];
      const relatedData = {};
      await Promise.all(
        relatedTables.map(async (relatedTable) => {
          relatedData[relatedTable] = await fetchTableData(relatedTable);
        }),
      );

      const result = await client.query(`SELECT * FROM ${tableName}`);

      for (const row of result.rows) {
        for (const field in row) {
          if (field.endsWith("_id")) {
            const relatedTableName = field.slice(0, -3) + "s";
            const relatedRow = relatedData[relatedTableName].find(
              (relatedRow) => relatedRow.id === row[field],
            );

            row[relatedTableName] = relatedRow;
            delete row[field];
          }
        }
      }

      return result.rows;
    }
  } catch (error) {
    throw error;
  }
}

function getRelationType(tableName) {
  return RELATION_TYPES[tableName];
}

async function fetchRelatedDataWithID(tableName) {
  try {
    const relatedTables = RELATIONS[tableName];
    const relatedData = {};

    await Promise.all(
      relatedTables.map(async (relatedTable) => {
        const result = await client.query(`SELECT * FROM ${relatedTable}`);

        relatedData[relatedTable] = result.rows;
      }),
    );

    const result = await client.query(`SELECT * FROM ${tableName}`);

    // for range split ":" in getRelationType(tableName)
    const cfx = getRelationType(tableName).split(":");
    for (var i = 0; i < cfx.length; i++) {
      var rel = cfx[i];

      var toCheckID = "id";
      var toCheckID2 = rel;
      if (rel.includes(",")) {
        toCheckID = rel.split(",")[1];
        toCheckID2 = rel.split(",")[0];
      }

      for (const row of result.rows) {
        for (const relatedTable of relatedTables) {
          var relatedRow;

          if (toCheckID2 !== "id") {
            relatedRow = relatedData[relatedTable].find(
              (relatedRow) => relatedRow[toCheckID] === row[toCheckID2],
            );
          } else {
            relatedRow = relatedData[relatedTable].find(
              (relatedRow) => relatedRow[getRelationType(tableName)] === row.id,
            );
          }

          // remove the foreign key
          try {
            delete relatedRow[getRelationType(tableName)];
          } catch (error) {}

          if (relatedTable.endsWith("s")) {
            row[relatedTable.slice(0, -1)] = relatedRow;
          } else {
            row[relatedTable] = relatedRow;
          }
        }
      }
    }

    return result.rows;
  } catch (error) {
    console.log(error);
  }
}

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send({ error: "Internal server error (e) =>" + err.message });
});

app.listen(port, () => {
  client.connect().then(() => {
    console.log("Connected to the database");
  });
  console.log(`Server is running on :${port}`);
});
