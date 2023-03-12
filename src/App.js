import React, { useState } from 'react';

function App() {
    const [file, setFile] = useState();

    const handelOnChange = (e) => {
        setFile(e.target.files[0]);
    };

    const fileReader = new FileReader();

    const handelOnSubmit = (e) => {
        e.preventDefault();

        if (file) {
            fileReader.onload = function (event) {
                const csvOutput = event.target.result;
                console.log(csvOutput);
            };

            fileReader.readAsText(file);
        }

        setFile(null);
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
        </div>
    );
}

export default App;
