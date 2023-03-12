import React, { useState } from 'react';

function App() {
    const csvDelimiter = ';';

    const [file, setFile] = useState();
    // const [table, setTable] = useState();

    const tableHeaders = ['Employee ID #1', 'Employee ID #2', 'Project ID', 'Days worked'];

    const fileReader = new FileReader();

    const handelOnChange = (e) => {
        if (e.target.files[0].type !== 'text/csv') {
            alert('Import .csv file');
        } else {
            setFile(e.target.files[0]);
        }
    };

    const csvFileToArrayOfObjectsGroupedByProject = (string) => {
        const header = string.slice(0, string.indexOf('\n')).split(csvDelimiter);
        const rows = string.slice(string.indexOf('\n') + 1).split('\n').map(r => r.split(csvDelimiter));
        
        const objectsGroupedByProject = rows.reduce((groupedByProject, row) => {
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

        return objectsGroupedByProject;
    };

    //TO DO
    const pairWithTheLongestPeriod = (string) => {
        // const projects = csvFileToArrayOfObjectsGroupedByProject(string);
        // console.log(Object.entries(projects));
        // const pearsInAProject = Object.entries(projects).reduce((result, project) => {

        //     console.log(project);
        //     return result;
        // }, []);

        // return pearsInAProject;
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
            <h1 style={{ marginBottom: '10px' }} >Pair of employees who have worked together</h1>

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

            <table>
                <thead>
                    <tr>
                        {tableHeaders.map((header, i) => (
                            <th key={i}>{header}</th>
                        ))}
                    </tr>
                </thead>

                <tbody>
                </tbody>
            </table>
        </div>
    );
}

export default App;
