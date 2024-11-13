import React from 'react'

function ABTable(props) {

  const { data, columns } = props;

  // columns = [
  //   {
  //     key: 'name',
  //     label: 'Student Name'
  //   },
  //   {
  //     key: 'fatherName',
  //     label: 'Father Name'
  //   },
  //   {
  //     key: 'cnic',
  //     label: 'CNIC Number'
  //   },
  // ]

  // data = [
  //   {
  //     name: "Haris",
  //     fatherName: "Muhammad Ahmed",
  //     cnic: "454613247651"
  //   },
  //   {
  //     name: "Haris",
  //     fatherName: "Muhammad Ahmed",
  //     cnic: "454613247651"
  //   },
  //   {
  //     name: "Haris",
  //     fatherName: "Muhammad Ahmed",
  //     cnic: "454613247651"
  //   },
  //   {
  //     name: "Haris",
  //     fatherName: "Muhammad Ahmed",
  //     cnic: "454613247651"
  //   },
  // ]

  return (
    <>
      <table className="min-w-full border border-gray-200 shadow-lg">
        <thead>
          <tr className="bg-gray-200">
            {columns.map((x, i) => (
              <th key={i} className="px-4 py-2 text-left font-semibold text-gray-700 border-b">
                {x.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((x, i) => (
            <tr key={i} className="hover:bg-gray-100">
              {columns.map((col, colInd) => (
                <td key={colInd} className="px-4 py-2 border-b text-gray-600">
                  {x[col.key]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>


    </>
  )
}

export default ABTable