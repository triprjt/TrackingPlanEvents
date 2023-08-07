const EventList = ({ events, onDelete, onEdit }) => {
  return (
    <table className="min-w-full border border-collapse">
      <thead>
        <tr>
          <th className="border p-2">Name</th>
          <th className="border p-2">Description</th>
          <th className="border p-2">Rules</th>
          <th className="border p-2">Actions</th>
        </tr>
      </thead>
      <tbody className="text-xs h">
        {events.length > 0 ? (
          events.map((ele, index) => (
            <tr
              className="cursor-pointer h-10 hover:bg-gray-300"
              key={index}
              onClick={() => onEdit(ele)}
            >
              <td className="border p-2 w-28">{ele.name}</td>
              <td className="border p-2 w-36">{ele.description}</td>
              <td className="border p-2 h-24 overflow-auto">
                {JSON.stringify(ele.rules)}
              </td>
              <td className="border p-2">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onDelete(index);
                  }}
                  className="bg-red-500 text-white p-1 rounded"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))
        ) : (
          <tr>
            <td className="border p-2 text-center" colSpan={4}>
              <NoData />
            </td>
          </tr>
        )}
      </tbody>
    </table>
  );
};

function NoData() {
  return (
    <div>
      <h1>No Events found in this Tracking Plan</h1>
    </div>
  );
}

export default EventList;
