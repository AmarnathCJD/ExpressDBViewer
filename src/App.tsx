/* eslint-disable jsx-a11y/anchor-is-valid */
/* eslint-disable tailwindcss/no-custom-classname */
/* eslint-disable tailwindcss/classnames-order */
import React, { useState, useEffect } from "react";
import { Button, Label, Modal, TextInput, Spinner, Popover, Textarea, Alert } from "flowbite-react";
import { infoAdd, infoDelete, infoEdit } from "./Const";
import { HiOutlineExclamationCircle, HiInformationCircle } from "react-icons/hi";

function isObject(value: any) {
  return typeof value === "object" && value !== null;
}

const BACK_END_URL = "https://db-express.onrender.com"

function EntitiesDashboard() {
  const [tableNames, setTableNames] = useState([]);
  const [selectedTableName, setSelectedTableName] = useState("");
  const [tableData, setTableData] = useState([]);

  const [openModal, setOpenModal] = useState(false);
  const [modalData, setModalData] = useState({});

  const [modalData2, setModalData2] = useState({});
  const [openModal2, setOpenModal2] = useState(false);

  const [selectedRow, setSelectedRow] = useState(-1);
  const [isLoading, setIsLoading] = useState(false);

  const [loadingScreenModal, setLoadingScreenModal] = useState(false);
  const [deleteModal, setDeleteModal] = useState(false);
  const [deleteModalData, setDeleteModalData] = useState();
  const [addModal, setAddModal] = useState(false);
  const [addModalData, setAddModalData] = useState({});

  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");

  const [showAlertSuccess, setShowAlertSuccess] = useState(false);

  const [open, setOpen] = useState(false);

  function handleEdit() {
    if (selectedRow === -1) {
      setAlertMessage("Please select a row to edit");
      setShowAlert(true);
      setTimeout(() => {
        setShowAlert(false);
      }, 7000);
      return;
    }
    const selectedData = tableData[selectedRow];

    handleEditModalOpen(selectedData);
  }

  function handleEditModalOpen(data: any) {
    setModalData2(data);
    setOpenModal2(true);
  }

  function handleModalOpen(data: any) {
    setModalData(data);
    setOpenModal(true);
  }

  useEffect(() => {
    setIsLoading(true);
    getTableNames();
  }, []);

  function getTableNames() {
    fetch(BACK_END_URL)
      .then((response) => response.json())
      .then((data) => {
        // remove pg_stat_statements
        data = data.filter((name: string) => name !== "pg_stat_statements");
        setTableNames(data);
        setSelectedTableName(data[0]);
        updateTable(data[0]);
      });
  }

  function updateTable(tableName: string) {
    setIsLoading(true);
    fetch(`${BACK_END_URL}/${tableName}`)
      .then((response) => response.json())
      .then((data) => {
        setTableData(data);
        setIsLoading(false);
        setLoadingScreenModal(false);
      });
  }

  function handleDelete() {
    console.log("Delete");
    if (selectedRow === -1) {

      setAlertMessage("Please select a row to delete");
      setShowAlert(true);
      setTimeout(() => {
        setShowAlert(false);
      }, 3000);
    }

    console.log(selectedRow);
    const selectedData = tableData[selectedRow];
    setDeleteModalData(selectedData);
    setDeleteModal(true);
  }

  function handleDeleteConfirm() {
    if (selectedRow === -1 || !deleteModalData) {
      setAlertMessage("Please select a row to delete");
      setShowAlert(true);
      setTimeout(() => {
        setShowAlert(false);
      }, 3000);
      return;
    }

    const deleteEndpoint = `${BACK_END_URL}/delete/${selectedTableName}/${(tableData[selectedRow] as { id: string }).id}`;

    fetch(deleteEndpoint, {
      method: "GET",
    }).then((response) => {
      if (response.status === 500) {
        response.json().then((data) => {
          setAlertMessage(data.error);
          setShowAlert(true);
          setTimeout(() => {
            setShowAlert(false);
          }, 5000);
        }
        );
      } else {
        setAlertMessage("Entity deleted successfully");
        setShowAlertSuccess(true);
        setTimeout(() => {
          setShowAlertSuccess(false);
        }, 8000);
      }
    })


    setDeleteModal(false);
    updateTable(selectedTableName);
  }

  function handleAdd() {
    setAddModalData(tableData[0]);
    setAddModal(true);
  }

  function handleConfirmAdd() {
    setAddModal(false);

    const addEndpoint = `${BACK_END_URL}/add/${selectedTableName}`;
    const datas: { [key: string]: string } = {};
    const querySelector: NodeListOf<Element> = document.querySelectorAll(".add-field");
    const qsData: NodeListOf<HTMLInputElement> = document.querySelectorAll(".add-field-data");



    querySelector.forEach((element: Element, index: number) => {
      if (element.textContent !== "[object Object]") {
        datas[element.textContent || ""] = qsData[index].value;
      }
    });

    // remove if '[object Object]' / object is present

    fetch(addEndpoint, {
      method: "POST",
      body: JSON.stringify(addModalData),
      headers: {
        "Content-Type": "application/json"
      },
    }).then((response) => {
      if (response.status === 500) {
        response.json().then((data) => {
          setAlertMessage(data.error);
          setShowAlert(true);
          setTimeout(() => {
            setShowAlert(false);
          }, 10000);
        });
      } else {
        setAlertMessage("Entity added successfully");
        setShowAlertSuccess(true);
        setTimeout(() => {
          setShowAlertSuccess(false);
        }, 8000);
      }
    });

    updateTable(selectedTableName);
  }

  function handleConfirmEdit() {
    setAddModal(false);

    const addEndpoint = `${BACK_END_URL}/update/${selectedTableName}`;
    const datas: { [key: string]: string } = {};
    const querySelector: NodeListOf<Element> = document.querySelectorAll(".add-field");
    const qsData: NodeListOf<HTMLInputElement> = document.querySelectorAll(".add-field-data");

    querySelector.forEach((element: Element, index: number) => {
      datas[element.textContent || ""] = qsData[index].value;
    });

    setIsLoading(true);

    fetch(addEndpoint, {
      method: "POST",
      body: JSON.stringify(addModalData),
      headers: {
        "Content-Type": "application/json"
      },
    }).then((response) => {
      if (response.status === 500) {
        response.json().then((data) => {
          setIsLoading(false);
          setAlertMessage(data.error);
          setShowAlert(true);
          setTimeout(() => {
            setShowAlert(false);
          }, 10000);
        });
      } else {
        setIsLoading(false);
        setAlertMessage("Entity updated successfully");
        setShowAlertSuccess(true);
        setTimeout(() => {
          setShowAlertSuccess(false);
        }, 8000);
      }
    });

    updateTable(selectedTableName);
  }

  function handleSqlQuery() {
    const query = document.getElementById("query") as HTMLInputElement;
    const queryValue = query.value;
    const queryUrl = `${BACK_END_URL}/sqlquery`;
    setIsLoading(true);

    fetch(queryUrl, {
      method: "POST",
      body: JSON.stringify({ query: queryValue }),
      headers: {
        "Content-Type": "application/json"
      }
    }).then((response) => {
      if (response.status === 500) {
        setIsLoading(false);
        response.json().then((data) => {
          setAlertMessage(data.error);
          setShowAlert(true);
          setTimeout(() => {
            setShowAlert(false);
          }, 10000);
        });
      } else {
        response.json().then((data) => {
          setIsLoading(false);
          setTableData(data);
          setAlertMessage("Query executed successfully");
          setShowAlertSuccess(true);
          setTimeout(() => {
            setShowAlertSuccess(false);
          }, 8000);

          query.value = "";
        });
      }
    });
  }


  function handleTableNameChange(e: React.ChangeEvent<HTMLSelectElement>) {
    const selectedTableName = e.target.value;
    setSelectedTableName(selectedTableName);
    updateTable(selectedTableName);
  }

  return (
    <div className="p-4 sm:p-8 lg:p-12">
      <div className="mx-auto w-full max-w-8xl overflow-hidden rounded-lg bg-white shadow-lg dark:bg-gray-800">
        <div className="bg-blue-500 p-6 text-white">
          <h2 className="text-xl font-semibold">Entities Dashboard</h2>
          <a className="font-mono font-bold text-xs" href="https://gist.githubusercontent.com/shahidhk/351f7201c9cc35be5fd9f40e48113637/raw/0692054166afb79c2c681b680e6c52dbdf65f95a/chinook_postgres.sql" target="_blank" rel="noreferrer">
            Chinook Postgres SQL
          </a>
        </div>
        <div className="p-6">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-lg font-semibold">Entities</h3>
            <span
              className="text-sm text-gray-600 dark:text-gray-400"
              id="table_count"
            >
              ({tableNames.length})
            </span>
          </div>
          <div className="mb-4 flex flex-col items-center justify-between space-y-4 md:flex-row md:space-x-4 md:space-y-0">
            <div className="flex space-x-4">
              <select
                id="table-select"
                className="font-bold font-mono block w-full appearance-none rounded border border-gray-300 bg-white px-4 py-2 leading-tight text-gray-700 shadow focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-gray-700 dark:bg-gray-700 dark:text-gray-400 md:w-auto"
                value={selectedTableName}
                onChange={handleTableNameChange}
              >
                {tableNames.map((name: string) => (
                  <option className="font-bold font-mono" key={name} value={name}>
                    {name.toUpperCase()}
                  </option>
                ))}
              </select>
              {isLoading && (
                <Spinner className="mt-1" color="failure" aria-label="Medium sized spinner example" size="md" />
              )}
            </div>

            <div className="flex space-x-4">

              <Popover
                aria-labelledby="area-popover"
                open={open}
                onOpenChange={setOpen}
                content={
                  <div className="flex w-64 flex-col gap-4 p-4 text-sm text-gray-500 dark:text-gray-400">
                    <div>
                      <h2 id="area-popover" className="text-base text-gray-500">SQL Query</h2>
                      <div className="mb-2 block">
                        <Label htmlFor="query" value="type your query" />
                      </div>
                      <Textarea id="query" className="font-mono" required rows={4} placeholder="SELECT * FROM table_name" />
                    </div>

                    <div className="flex gap-2">
                      <Button color="gray">Cancel</Button>
                      <Button color="success" onClick={() => handleSqlQuery()}>
                        Execute
                      </Button>
                    </div>
                  </div>
                }
              >
                <button className="rounded bg-yellow-500 px-4 py-2 text-sm font-medium text-white hover:bg-yellow-600">
                  Raw Query
                </button>
              </Popover>
              <Popover content={infoAdd} trigger="hover">
                <button className="rounded bg-blue-500 px-4 py-2 text-sm font-medium text-white hover:bg-blue-600" onClick={handleAdd}>
                  Add Entity
                </button>
              </Popover>

              <button className="rounded bg-red-500 px-4 py-2 text-sm font-medium text-white hover:bg-red-600" onClick={() => handleDelete()}>
                Delete Entity
              </button>

              <Popover content={infoEdit} trigger="hover">
                <button className="rounded bg-green-500 px-4 py-2 text-sm font-medium text-white hover:bg-green-600" onClick={handleEdit}>
                  Edit Entity
                </button>
              </Popover>
            </div>
          </div>
          <div className="overflow-x-auto space-y-2">
            {showAlert && (
              <Alert color="failure" className="px-4 py-2" icon={HiInformationCircle}>
                <span className="font-medium">{alertMessage}</span>
              </Alert>
            )}
            {showAlertSuccess && (
              <Alert color="success" className="px-4 py-2" icon={HiInformationCircle}>
                <span className="font-medium">{alertMessage}</span>
              </Alert>
            )}
            {loadingScreenModal && false && (
              <Modal className="bg-transparent rounded-lg" show={loadingScreenModal} size="md" onClose={() => setLoadingScreenModal(false)}>
                <Modal.Body className="mt-8 bg-transparent">
                  <div className="text-center">
                    <Spinner className="mt-1 mb-2" color="failure" aria-label="Medium sized spinner example" size="xl" />
                    <p className="my-4">Processing...</p>
                  </div>
                </Modal.Body>
              </Modal>)}
            <Modal show={deleteModal} size="md" onClose={() => setDeleteModal(false)} popup>
              <Modal.Header />
              <Modal.Body>
                <div className="text-center">
                  <HiOutlineExclamationCircle className="mx-auto mb-4 size-14 text-gray-400 dark:text-gray-200" />
                  <h3 className="mb-5 text-lg font-normal text-gray-500 dark:text-gray-400">
                    Are you sure you want to delete this entity?
                  </h3>
                  <div className="flex justify-center gap-4">
                    <Button color="failure" onClick={() => handleDeleteConfirm()}>
                      {"Yes, I'm sure"}
                    </Button>
                    <Button color="gray" onClick={() => setDeleteModal(false)}>
                      No, cancel
                    </Button>
                  </div>
                </div>
              </Modal.Body>
            </Modal>

            <Modal show={openModal} onClose={() => setOpenModal(false)}>
              <Modal.Header>
                <h2 className="text-lg font-semibold">Relation Details</h2>
              </Modal.Header>
              <Modal.Body>
                <div className="space-y-2">
                  {Object.entries(modalData).map(([key, value]) => (
                    <div key={key} className="flex">
                      <span className="font-bold">{key} ~ </span>
                      <span className="ml-2">{isObject(value) ? (
                        <button onClick={() => handleModalOpen(value)}><span className="text-blue-500">View</span></button>
                      ) : value !== null ? (
                        String(value)
                      ) : (
                        "-"
                      )}</span>
                    </div>
                  ))}
                </div>
              </Modal.Body>

              <Modal.Footer>
                <Button color="red" onClick={() => setOpenModal(false)}>
                  Close
                </Button>
              </Modal.Footer>
            </Modal>


            <Modal show={openModal2} size="md" popup onClose={() => setOpenModal2(false)}>
              <Modal.Header />
              <Modal.Body>
                <div className="space-y-6">
                  <h3 className="text-xl font-medium text-gray-900 dark:text-white">Edit Entity Fields</h3>
                  <div className="grid grid-cols-1 gap-6">
                    {Object.entries(modalData2).map(([key, value]) => (
                      <div key={key}>
                        <div className="mb-2 block"><Label>{key}</Label></div>
                        <TextInput className="font-mono font-bold" defaultValue={String(value)} />
                      </div>
                    ))}
                    <div className="flex justify-end space-x-4">
                      <Button color="green" onClick={() => handleConfirmEdit()}>Save</Button>
                      <Button color="red" onClick={() => setOpenModal2(false)}>Cancel</Button>
                    </div>
                  </div>
                </div>
              </Modal.Body>
            </Modal>

            <Modal show={addModal} size="md" popup onClose={() => setAddModal(false)}>
              <Modal.Header />
              <Modal.Body>
                <div className="space-y-6">
                  <h3 className="text-xl font-medium text-gray-900 dark:text-white">Add New Entity</h3>
                  <div className="grid grid-cols-1 gap-6">
                    {Object.entries(addModalData).map(([key, value]) => (
                      <div key={key}>
                        <div className="mb-2 block add-field"><Label>{key}</Label></div>
                        <TextInput className="font-mono font-bold add-field-data" defaultValue="" />
                      </div>
                    ))}
                    <div className="flex justify-end space-x-4">
                      <Button color="green" onClick={() => handleConfirmAdd()}>Add</Button>
                      <Button color="red" onClick={() => setAddModal(false)}>Cancel</Button>
                    </div>
                  </div>
                </div>
              </Modal.Body>
            </Modal>


            <table className="w-full text-sm text-gray-800 dark:text-gray-200">
              <thead id="thead" className="bg-gray-100 dark:bg-gray-700">
                <tr>
                  <th scope="col" className="px-6 py-3">
                    <input type="checkbox" className="form-checkbox" data-id="all" />
                  </th>
                  {Object.keys(tableData[0] || {}).map((key) => (
                    <th key={key} scope="col" className="px-6 py-3">
                      {key.toUpperCase().replaceAll("_", " ")}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody id="tbody" className="bg-white dark:bg-gray-800">
                {tableData.map((row, index) => (
                  <tr
                    key={index}
                    className="border-b bg-white hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800"
                  >
                    <th scope="row" className="px-6 py-4">
                      <input type="checkbox" className="form-checkbox" data-id={index} onClick={() => setSelectedRow(index)} />
                    </th>

                    {Object.values(row).map((value, index) => (
                      <td key={index} className="text-bold px-6 py-4"><span className="text-sm dark:text-gray-400 font-bold font-mono {value === null ? 'text-gray-400' : ''}">
                        {isObject(value) ? (
                          <button onClick={() => handleModalOpen(value)}><span className="text-blue-500">View</span></button>
                        ) : value !== null ? (
                          String(value)
                        ) : (
                          "-"
                        )}
                      </span></td>
                    ))}

                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

export default EntitiesDashboard;
