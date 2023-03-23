import React, { useState } from 'react';
import FileImportForm from './components/FileImportForm';
import ResultTable from './components/ResultTable';

function App() {
    const [file, setFile] = useState();
    const [table, setTable] = useState();

    return (
        <div style={{ textAlign: 'center', marginTop: '50px' }} >
            <h1 style={{ marginBottom: '30px' }} >Pair of employees who have worked together</h1>

            <FileImportForm file={file} setFile={setFile} setTable={setTable} />

            <br />

            {file && 
                <ResultTable table={table} />
            }
        </div>
    );
}

export default App;
