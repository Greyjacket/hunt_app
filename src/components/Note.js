import React, { useState } from 'react';
import NoteEditor from './NoteEditor';

function Note({ note, date, onEdit, onSave }) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedNote, setEditedNote] = useState(note);
  const [addendum, setAddendum] = useState('');

  const handleEdit = () => {
    setIsEditing(true);
    onEdit();
  };

  const handleSave = () => {
    setIsEditing(false);
    onSave(editedNote);
  };

  const handleAddAddendum = (event) => {
    setAddendum(event.target.value);
  };

  return (
    <div>
      {isEditing ? (
        <div>
          <NoteEditor value={editedNote} onChange={setEditedNote} />
          <button onClick={handleSave}>Save</button>
          <input placeholder="Add addendum" onChange={handleAddAddendum} />
        </div>
      ) : (
        <div>
            <p>{date}</p>

          <p>{note}</p>
          {addendum && <p style={{ paddingLeft: '2em' }}>- {addendum}</p>}
          <button onClick={handleEdit}>Edit</button>
        </div>
      )}
    </div>
  );
}

export default Note;