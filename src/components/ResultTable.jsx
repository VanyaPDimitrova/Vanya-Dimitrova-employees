
const ResultTable = ({ table }) => {
  const tableHeaders = ['Employee ID #1', 'Employee ID #2', 'Project ID', 'Days worked'];

  return (
    table?.length === 0 ?
      <h3>No such pair</h3> :

      (table && 
          <table>
              <thead>
                  <tr>
                      {tableHeaders.map((header, i) => (
                          <th key={i}>{header}</th>
                      ))}
                  </tr>
              </thead>

              <tbody>
                  {table?.map((row, i) => (
                      <tr key={i}>
                          {row.map((cell, i) => (
                              <td key={i}>
                                  {cell}
                              </td>
                          ))}
                      </tr>
                  ))}
              </tbody>
          </table>
      )
  )
};

export default ResultTable;
