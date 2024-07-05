const QUERY_TEMPLATES = {
  basic: {
    label: "Basic SELECT",
    description: "View all records in a table",
    template: "SELECT * FROM {table}",
  },
  count: {
    label: "Count Records",
    description: "Count total records in a table",
    template: "SELECT COUNT(*) as total FROM {table}",
  },
  distinct: {
    label: "Distinct Values",
    description: "Get unique values from a column",
    template: "SELECT DISTINCT {column} FROM {table} LIMIT 50",
  },
  orderBy: {
    label: "Order By",
    description: "Sort records by a column",
    template: "SELECT * FROM {table} ORDER BY {column} DESC LIMIT 100",
  },
  limit: {
    label: "Limit Results",
    description: "Get first N records",
    template: "SELECT * FROM {table} LIMIT 10",
  },
  aggregate: {
    label: "Aggregate Functions",
    description: "Calculate statistics (MIN, MAX, AVG)",
    template: "SELECT COUNT(*), AVG({numeric_column}), MAX({numeric_column}) FROM {table}",
  },
  join: {
    label: "Inner Join",
    description: "Join two tables on a condition",
    template: "SELECT * FROM {table1} INNER JOIN {table2} ON {table1}.id = {table2}.{table1}_id LIMIT 50",
  },
  groupBy: {
    label: "Group By",
    description: "Group and aggregate data",
    template: "SELECT {column}, COUNT(*) as count FROM {table} GROUP BY {column} ORDER BY count DESC",
  },
  dateFilter: {
    label: "Date Filter",
    description: "Filter records by date range",
    template: "SELECT * FROM {table} WHERE {date_column} BETWEEN '2023-01-01' AND '2023-12-31' LIMIT 100",
  },
  search: {
    label: "Text Search",
    description: "Search for text in a column",
    template: "SELECT * FROM {table} WHERE {text_column} ILIKE '%search_term%' LIMIT 50",
  },
  caseStatement: {
    label: "CASE Statement",
    description: "Conditional logic in SELECT",
    template: "SELECT *, CASE WHEN {condition} THEN 'true' ELSE 'false' END as result FROM {table} LIMIT 100",
  },
  subquery: {
    label: "Subquery",
    description: "Query within a query",
    template: "SELECT * FROM {table} WHERE {id_column} IN (SELECT {id_column} FROM {table} WHERE {condition}) LIMIT 100",
  },
};

export { QUERY_TEMPLATES };
