import { csvFileHeaderAndRows, pairCommonDays, stringToDate } from '../utils/functions';
import { CSV_DELIMITER, EMPTY_LAST_CELL_IN_CSV } from './../utils/constants';

const FileImportForm = ({ file, setFile, setTable }) => {
  const fileReader = new FileReader();

  const handelOnChange = (e) => {
    if (e.target.files[0].type !== 'text/csv') {
        alert('Import .csv file');
    } else {
        setFile(e.target.files[0]);
    }
  };

  const cells = (element) => {
    const keys = Object.keys(element);
    const EmpID = element[keys[0]];
    const ProjectID = element[keys[1]];
    const DateFrom = stringToDate(element[keys[2]]);
    const DateTo = element[keys[3]] === EMPTY_LAST_CELL_IN_CSV ? new Date() : stringToDate(element[keys[3]]);

    return [EmpID, ProjectID, DateFrom, DateTo];
  };

  const objectsGroupedByProject = (string, csvDelimiter) => {
    const [header, rows] = csvFileHeaderAndRows(string, csvDelimiter);
    
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

  const pairWithTheLongestPeriod = (string, csvDelimiter) => {
    const projects = objectsGroupedByProject(string, csvDelimiter);

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

  const handelOnSubmit = (e, csvDelimiter) => {
    e.preventDefault();

    if (file) {
        fileReader.onload = function (event) {
            const csvOutput = event.target.result;
            pairWithTheLongestPeriod(csvOutput, csvDelimiter);
        };

        fileReader.readAsText(file);
    }
};

  return (
    <form>
        <input 
            id='csvFileInput'
            type='file' 
            accept='.csv'
            onChange={handelOnChange}
        />
        <button
            onClick={e => {
                handelOnSubmit(e, CSV_DELIMITER);
            }}
        >
            Import CSV
        </button>
    </form>
  );
};

export default FileImportForm;
