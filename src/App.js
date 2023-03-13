import React, { useState } from 'react';

function App() {
    const csvDelimiter = ';';
    const emptyLastCellInCSV = '\r';

    const [file, setFile] = useState();
    const [table, setTable] = useState();

    const tableHeaders = ['Employee ID #1', 'Employee ID #2', 'Project ID', 'Days worked'];

    const fileReader = new FileReader();

    const handelOnChange = (e) => {
        if (e.target.files[0].type !== 'text/csv') {
            alert('Import .csv file');
        } else {
            setFile(e.target.files[0]);
        }
    };

    const csvFileHeaderAndRows = (string) => {
        const header = string.slice(0, string.indexOf('\n')).split(csvDelimiter);
        const rows = string.slice(string.indexOf('\n') + 1).split('\n').map(r => r.split(csvDelimiter));

        return [header, rows];
    }

    const objectsGroupedByProject = (string) => {
        const [header, rows] = csvFileHeaderAndRows(string);
        
        return rows.reduce((groupedByProject, row) => {
           const currentRow = row.reduce((obj, cell, i) => {
                obj[header[i]] = cell;
                return obj;
            }, {});

            const currentProjectID = currentRow['ProjectID'];

            if (Object.keys(groupedByProject).includes(currentProjectID)) {
                groupedByProject[currentProjectID].push(currentRow);
            } else {
                groupedByProject[currentProjectID] = [currentRow];
            }

            return groupedByProject;
        }, {});
    };

    const stringToDate = (string) => {
        const [dd, mm, yyyy] = string.split('.');

        return new Date(yyyy, Number(mm) - 1, dd);
    };

    const dateDiffInDays = (dateDiffInMs) => Math.ceil(dateDiffInMs / (1000 * 60 * 60 * 24));

    const cells = (element) => {
        const keys = Object.keys(element);
        const EmpID = element[keys[0]];
        const ProjectID = element[keys[1]];
        const DateFrom = stringToDate(element[keys[2]]);
        const DateTo = element[keys[3]] === emptyLastCellInCSV ? new Date() : stringToDate(element[keys[3]]);

        return [EmpID, ProjectID, DateFrom, DateTo];
    };

    const pairCommonDays = (DateFrom, DateTo, jDateFrom, jDateTo) => {
        let commonDays = 0;

        if (jDateFrom <= DateFrom && DateFrom <= jDateTo) {
            commonDays = dateDiffInDays(jDateTo - DateFrom) + 1;
        } else if (jDateFrom <= DateTo && DateTo <= jDateTo) {
            commonDays = dateDiffInDays(DateTo - jDateFrom) + 1;
        } else if (DateFrom <= jDateFrom && jDateTo <= DateTo) {
            commonDays = dateDiffInDays(jDateTo - jDateFrom) + 1;
        } else if (jDateFrom <= DateFrom && DateTo <= jDateTo) {
            commonDays = dateDiffInDays(DateTo - DateFrom) + 1;
        }

        return commonDays;
    }

    const pairWithTheLongestPeriod = (string) => {
        const projects = objectsGroupedByProject(string);

        const pairsInProject = Object.values(projects).reduce((result, project) => {
            const pears = result[0];
            const maxPair = result[1];

            project
                .sort((a,b) => Number(a.EmpID) - Number(b.EmpID))
                .forEach((empRow, i, rowsPerEmp) => {
                    const [EmpID, ProjectID, DateFrom, DateTo] = cells(empRow);
                    for (let j = i + 1; j < rowsPerEmp.length; j++) {
                        const [jEmpID, , jDateFrom, jDateTo] = cells(rowsPerEmp[j]);

                        const currentPair = `${EmpID}/${jEmpID}`;

                        let commonDays = pairCommonDays(DateFrom, DateTo, jDateFrom, jDateTo);


                        if (commonDays > 0) {
                            if (Object.keys(pears).includes(currentPair)) {
                                let newCommonDays =  Number(pears[currentPair]['allCommonDays']) + commonDays;

                                if (Number(maxPair['days']) < newCommonDays) {
                                    maxPair['pairs'].splice(0);
                                    maxPair['pairs'].push(currentPair);
                                    maxPair['days'] = newCommonDays;
                                } else if (Number(maxPair['days']) === newCommonDays) {
                                    maxPair['pairs'].push(currentPair);
                                }

                                pears[currentPair] = { 
                                    ...pears[currentPair], 
                                    [ProjectID]: commonDays, 
                                    allCommonDays: newCommonDays,
                                }
                            } else {
                                if (Number(maxPair['days']) < commonDays) {
                                    maxPair['pairs'].splice(0);
                                    maxPair['pairs'].push(currentPair);
                                    maxPair['days'] = commonDays;
                                } else if (Number(maxPair['days']) === commonDays) {
                                    maxPair['pairs'].push(currentPair);
                                }

                                pears[currentPair] = {
                                    [ProjectID]: commonDays, 
                                    allCommonDays: commonDays,
                                }
                            } 
                        }
                    }

                });

            return result;
        }, [{}, {pairs: [], days: ''}]);

        const maxPairProjects = (pairsInProject) => {
            const pairs = pairsInProject[0];
            const maxPairs = pairsInProject[1]['pairs'];
            const toPrint = [];
            maxPairs.forEach((pair) => {
                for (const project in pairs[pair]) {
                    const rowToPrint = pair.split('/');

                    if (project !== 'allCommonDays') {
                        rowToPrint.push(project);
                        rowToPrint.push(pairs[pair][project]);
                        toPrint.push(rowToPrint);
                    }

                }
            })

            return toPrint;
        };

        setTable(maxPairProjects(pairsInProject));
    };

    const handelOnSubmit = (e) => {
        e.preventDefault();

        if (file) {
            fileReader.onload = function (event) {
                const csvOutput = event.target.result;
                pairWithTheLongestPeriod(csvOutput);
            };

            fileReader.readAsText(file);
        }
    };

    return (
        <div style={{ textAlign: 'center', marginTop: '50px' }} >
            <h1 style={{ marginBottom: '30px' }} >Pair of employees who have worked together</h1>

            <form>
                <input 
                    id='csvFileInput'
                    type='file' 
                    accept='.csv'
                    onChange={handelOnChange}
                />
                <button
                    onClick={e => {
                        handelOnSubmit(e);
                    }}
                >
                    Import CSV
                </button>
            </form>

            <br />

            {file && 
                (table?.length === 0 ?
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
            }
        </div>
    );
}

export default App;
