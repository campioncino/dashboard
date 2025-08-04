import React from 'react';

const CodeEditor = ({ value, onChange, readOnly = false }) => {
  const handleChange = (e) => {
    if (!readOnly && onChange) {
      onChange(e.target.value);
    }
  };

  return (
    <div className="relative">
      <div className="absolute top-3 left-3 text-xs font-mono text-gray-400 z-10">
        {readOnly ? 'Sola lettura' : 'Editor Codice'}
      </div>
      <textarea
        value={value}
        onChange={handleChange}
        readOnly={readOnly}
        className={`w-full h-full min-h-[400px] p-4 pt-10 font-mono text-sm border rounded-lg resize-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:outline-none ${
          readOnly ? 'bg-gray-50' : 'bg-white'
        }`}
        placeholder={readOnly ? '' : 'Scrivi il tuo codice qui...'}
        spellCheck={false}
        style={{
          lineHeight: '1.5',
          tabSize: '2'
        }}
      />
      <div className="absolute bottom-3 right-3 text-xs text-gray-400">
        Righe: {value?.split('\n').length || 0}
      </div>
    </div>
  );
};

export default CodeEditor;