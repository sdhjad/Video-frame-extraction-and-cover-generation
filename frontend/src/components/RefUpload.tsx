import { useState, type DragEvent } from 'react';

type Props = { onChange: (value: string) => void };

export function RefUpload({ onChange }: Props) {
  const [preview, setPreview] = useState('');
  const [name, setName] = useState('');

  function useFile(file?: File) {
    if (!file) return clear();
    const reader = new FileReader();
    reader.onload = () => {
      const value = String(reader.result || '');
      setPreview(value);
      setName(file.name);
      onChange(value);
    };
    reader.readAsDataURL(file);
  }

  function drop(event: DragEvent<HTMLLabelElement>) {
    event.preventDefault();
    useFile(event.dataTransfer.files?.[0]);
  }

  function clear() {
    setPreview('');
    setName('');
    onChange('');
  }

  return <div className="refUploadBox">
    <label className={preview ? 'refDrop hasPreview' : 'refDrop'} onDragOver={(e) => e.preventDefault()} onDrop={drop}>
      <input type="file" accept="image/*" onChange={(e) => useFile(e.target.files?.[0])} />
      {preview ? <img src={preview} alt={name} /> : <span>拖拽或点击上传参考封面</span>}
    </label>
    {preview && <button className="clearRef" onClick={clear}>移除参考图</button>}
  </div>;
}
