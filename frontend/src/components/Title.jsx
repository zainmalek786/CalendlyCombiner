import React from 'react';

function Title() {
    return (
        <div className="w-screen bg-blue-700 md:text-[60px] text-[20px] font-bold flex justify-center  shadow-md shadow-blue-800 top-0 static  ">
            <h1 
                className='
                  text-slate-200 drop-shadow-xl shadow-blue-900'
                style={{
                    fontFamily: "'Cookie', serif",
                    fontWeight: 800,
                    fontStyle: "normal",
                }}
            >
                Calendly <br />
                &nbsp;&nbsp;&nbsp;&nbsp;&nbsp; Combiner
            </h1>
        </div>
    );
}

export default Title;
