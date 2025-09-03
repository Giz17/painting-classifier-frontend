import React, { useState } from 'react';
import { transferStyle } from '../utils/styleTransferImage'

function StyleTransferComponent() {
  const [file, setFile] = useState(null);
  const [style, setStyle] = useState('candy');

  const handleTransfer = async () => {
    if (!file || !style) return alert('Select file and style first');

    try {
      const { url, filename } = await transferStyle(file, style);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', filename);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (err) {
      console.error(err);
      alert('Style transfer failed');
    }
  };

  return (
    <div>
      <input type="file" accept="image/*" onChange={e => setFile(e.target.files[0])} />
      <select value={style} onChange={e => setStyle(e.target.value)}>
        <option value="candy">Candy</option>
        <option value="mosaic">Mosaic</option>
        <option value="udnie">Udnie</option>
        <option value="rain_princess">Rain Princess</option>
      </select>
      <button onClick={handleTransfer}>Stylize & Download</button>
    </div>
  );
}

export default StyleTransferComponent;
