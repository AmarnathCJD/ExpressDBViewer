
const infoEdit = (
  <div className="w-64 text-sm text-gray-500 dark:text-gray-400">
    <div className="border-b border-gray-200 bg-gray-100 px-3 py-2 dark:border-gray-600 dark:bg-gray-700">
      <h3 className="font-semibold text-gray-900 dark:text-white">Edit Entity</h3>
    </div>
    <div className="px-3 py-2">
      <p>Select a row to edit the entity.</p>
    </div>
  </div>
);

const infoDelete = (
  <div className="w-64 text-sm text-gray-500 dark:text-gray-400">
    <div className="border-b border-gray-200 bg-gray-100 px-3 py-2 dark:border-gray-600 dark:bg-gray-700">
      <h3 className="font-semibold text-gray-900 dark:text-white">Delete Entity</h3>
    </div>
    <div className="px-3 py-2">
      <p>Select a row to delete the entity.</p>
    </div>
  </div>
);

const infoAdd = (
  <div className="w-64 text-sm text-gray-500 dark:text-gray-400">
    <div className="border-b border-gray-200 bg-gray-100 px-3 py-2 dark:border-gray-600 dark:bg-gray-700">
      <h3 className="font-semibold text-gray-900 dark:text-white">Add Entity</h3>
    </div>
    <div className="px-3 py-2">
      <p>Click to add a new entity.</p>
    </div>
  </div>
);

const searchInfo = (
  <div className="w-64 text-sm text-gray-500 dark:text-gray-400">
    <div className="border-b border-gray-200 bg-gray-100 px-3 py-2 dark:border-gray-600 dark:bg-gray-700">
      <h3 className="font-semibold text-gray-900 dark:text-white">Search Entity</h3>
    </div>
    <div className="px-3 py-2">
      <p>Search for an entity, complete the query in SQL format.</p>
    </div>
  </div>
);

export { infoEdit, infoDelete, infoAdd, searchInfo };