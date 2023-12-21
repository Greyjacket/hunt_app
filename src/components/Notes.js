import React, { useState, useEffect } from 'react';
import { Box, Heading, Button, Input, VStack, HStack, Text, Textarea } from '@chakra-ui/react';
import { useParams } from 'react-router-dom';
import './Notes.css';


function Notes() {
    const [content, setContent] = useState("");
    const [notes, setNotes] = useState([]);
    const [editId, setEditId] = useState(null);
    const [addendum, setAddendum] = useState("");
    const [editAddendumKey, setEditAddendumKey] = useState(null);
    const [showAddAddendum, setShowAddAddendum] = useState(false);
    const [showAddAddendumButton, setShowAddAddendumButton] = useState(true);
    const [tempNote, setTempNote] = useState({ id: null, lead_id: null, content: "", addenda: [] });    
    const [tempAddendum, setTempAddendum] = useState(null);
    const { id } = useParams();

    async function syncNotes() {
        const API_BASE_URL = process.env.NODE_ENV === 'production' ? process.env.REACT_APP_API_BASE_URL : process.env.REACT_APP_DEV_API_URL;
        const response = await fetch(`${API_BASE_URL}leads/${id}/notes`);
        if (!response.ok) {
            console.error(`Failed to fetch notes: ${response.status}`);
            return;
        }
        const data = await response.json();
        setNotes(data);
    }

    useEffect(() => {
        syncNotes();
    }, []); // Empty dependency array means this effect runs once on mount

    async function handleNoteCreate() {
        const API_BASE_URL = process.env.NODE_ENV === 'production' ? process.env.REACT_APP_API_BASE_URL : process.env.REACT_APP_DEV_API_URL;
        if (content.trim() === '') {
            alert('Note text cannot be empty!');
            return;
        }
        const note = {lead_id: id, content: content, addenda: [] };

        // Send a POST request
        await fetch(`${API_BASE_URL}notes`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(note)
        })
        .then(() => syncNotes())
        .catch((response) => {
            console.error(`Failed to create note: ${response.status}`)})
        setContent("");
    }

    async function handleNoteUpdate() {
        const API_BASE_URL = process.env.NODE_ENV === 'production' ? process.env.REACT_APP_API_BASE_URL : process.env.REACT_APP_DEV_API_URL;
        let note = notes.find(note => note.id === editId);
        let noteUpdate = {
            'content': tempNote.content,
            'addenda': tempNote.addenda.map(addendum => {
                const { id, ...addendumWithoutId } = addendum;
                return isNaN(id) ? addendum : addendumWithoutId;
            })
        }
        // Send a PUT request
        await fetch(`${API_BASE_URL}notes/${editId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(noteUpdate)
        })
        .then(() => syncNotes())
        .catch((response) => {
            console.error(`Failed to update note: ${response.status}`)})
    }

    async function handleNoteDelete() {
        const API_BASE_URL = process.env.NODE_ENV === 'production' ? process.env.REACT_APP_API_BASE_URL : process.env.REACT_APP_DEV_API_URL;

        // Send a PUT request
        await fetch(`${API_BASE_URL}notes/${editId}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json'
            },
        })
        .catch((response) => {
            console.error(`Failed to delete note: ${response.status}`)})
    }   

    function edit(id, content, addenda) {
        setEditId(id);
        setTempNote({ id, content, addenda: [...addenda] });
    }

    function remove(id) {
        if (window.confirm("Are you sure you want to delete this note?")) {
            handleNoteDelete();
            setNotes(notes.filter((e) => e.id !== id));
            setEditId(null);
        }
    }

    function handleEditChange(id, value) {
        // Find the note with the given id and update its description
        const updatedNotes = notes.map(note => note.id === id ? { ...note, content: value } : note);
        setNotes(updatedNotes);
    }

    function commitEdit() {
        handleNoteUpdate();
        setEditId(null);
        setShowAddAddendum(false);
        setTempNote(null);
        setShowAddAddendumButton(true);
        setEditAddendumKey(null);
    }

    function cancelEdit() {
        setEditId(null);
        setEditAddendumKey(null);
        setShowAddAddendum(false);
        setTempNote(null);
        setAddendum("");
        setShowAddAddendumButton(true);
        setTempAddendum(null);
        syncNotes();
    }

    function addAddendum(noteId) {
        // Create a new addendum with a reference to the note's ID
        const newAddendum = { content: addendum, note_id: noteId, id: Date.now() };
        setNotes(notes.map(note => note.id === noteId ? { ...note, addenda: [...note.addenda, newAddendum] } : note));
        setTempNote({ ...tempNote, addenda: [...tempNote.addenda, newAddendum] });

        setAddendum("");
        setShowAddAddendum(false);
    }

    function editAddendum(noteId, addendumId, content) {
        let note_id = noteId;
        let id = addendumId;
        let addendumKey = addendumId;

        setTempAddendum({ note_id, id, content })
        setEditAddendumKey({ noteId, addendumKey });
    }

    function handleAddendum() {
        if (editAddendumKey !== null) {
            setNotes(notes.map(note => note.id === editAddendumKey.noteId ? { ...note, addenda: note.addenda.map(addendum => addendum.id === editAddendumKey.addendumKey ? { id: editAddendumKey.addendumKey, content: tempAddendum.content } : addendum) } : note));
            setEditAddendumKey(null);
            setTempAddendum(null);
        } else {
            addAddendum(editId);
        }
        setAddendum("");
        setShowAddAddendumButton(true);
    }

    function saveAddendumEdit() {
        setNotes(notes.map(note => note.id === editAddendumKey.noteId ? { ...note, addenda: note.addenda.map(addendum => addendum.id === editAddendumKey.addendumKey ? { id: editAddendumKey.addendumKey, content: tempAddendum.content } : addendum) } : note));
        setTempNote({ ...tempNote, addenda: tempNote.addenda.map(addendum => addendum.id === editAddendumKey.addendumKey ? { id: editAddendumKey.addendumKey, content: tempAddendum.content, note_id: editAddendumKey.noteId } : addendum) });
        setEditAddendumKey(null);
        setTempAddendum(null);
    }

    function removeAddendum(noteId, addendumKey) {
        setNotes(notes.map(note => note.id === noteId ? { ...note, addenda: note.addenda.filter(addendum => addendum.id !== addendumKey) } : note));
        setTempNote({ ...tempNote, addenda: tempNote.addenda.filter(addendum => addendum.id !== addendumKey) });
    }

    function cancelAddendumEdit() {
        setEditAddendumKey(null);
        setTempAddendum(null);
    }

    return (
    <Box className="App" p={5} w="50%">
        <Box className="card" border="1px" borderColor="gray.200" borderRadius="md" p={5}>
            <Box className="head">
                <Heading fontSize="lg" textAlign="center" mb={4}>Notes</Heading>
            </Box>
            <VStack spacing={4} className="notes">
                {notes.map((note) => (
                    <Box 
                        key={note.id} 
                        w="100%" 
                        p={4} 
                        border="1px" 
                        borderColor="gray.200" 
                        borderRadius="md" 
                        _hover={{ bg: "gray.100" }} 
                        className="note-container"
                        bg={editId === note.id ? "red.400" : ""}
                    >
                        <HStack justifyContent="space-between" alignItems="center">
                            <VStack align="start" w="90%">
                                <Text fontSize="lg" textDecoration="underline">{new Date(note.created_at).toLocaleDateString()}</Text>
                                {editId === note.id ? (
                                    <Input 
                                        w="100%" 
                                        value={tempNote.content} 
                                        onChange={(event) => setTempNote({ ...tempNote, content: event.target.value })}
                                    />
                                ) : (
                                    <Text>{note.content}</Text>
                                )}
                                {note.addenda.map((addendum, index) => (
                                    <HStack key={addendum.id}>
                                        {editAddendumKey !== null && editAddendumKey.addendumKey === addendum.id ? (
                                            <Input 
                                                value={tempAddendum.content} 
                                                onChange={(event) => setTempAddendum({ ...tempAddendum, content: event.target.value })}
                                            />
                                        ) : (
                                            <Text ml={15} fontSize="sm">• {addendum.content}</Text>
                                        )}
                                        {editId === note.id && (
                                            <>
                                                <Button 
                                                    size="xs" 
                                                    onClick={() => editAddendum(note.id, addendum.id, addendum.content)} 
                                                    isDisabled={editAddendumKey !== null && editAddendumKey.addendumKey !== addendum.id}
                                                >
                                                    Edit
                                                </Button>
                                                {editAddendumKey !== null && editAddendumKey.addendumKey === addendum.id && (
                                                    <>
                                                        <Button size="xs" onClick={saveAddendumEdit}>Save</Button>
                                                        <Button size="xs" onClick={cancelAddendumEdit}>Cancel</Button>
                                                    </>
                                                )}
                                                <Button size="xs" onClick={() => removeAddendum(note.id, addendum.id)}>Delete</Button>
                                            </>
                                        )}
                                    </HStack>
                                ))}
                                {editId === note.id && (
                                    <>
                                        {showAddAddendum && (
                                            <HStack spacing={4}>
                                                <Textarea 
                                                    placeholder="Addendum content here" 
                                                    value={addendum} 
                                                    onChange={(e) => setAddendum(e.target.value)} 
                                                />
                                                <Button 
                                                    colorScheme="blue" 
                                                    onClick={handleAddendum} 
                                                    w="200px" 
                                                    isDisabled={editAddendumKey !== null}
                                                >
                                                    {editAddendumKey !== null ? 'Update Addendum' : 'Add'}
                                                </Button>
                                            </HStack>
                                        )}
                                    </>
                                )}
                            </VStack>
                            <HStack className="note-buttons">
                                {editId === note.id && showAddAddendumButton && (
                                    <Button 
                                        colorScheme="blue" 
                                        boxShadow="0px 4px 4px rgba(0, 0, 0, 0.25)"
                                        onClick={() => { setShowAddAddendum(true); setShowAddAddendumButton(false); }}
                                    >
                                        Addendum
                                    </Button>
                                )}
                                {editId === note.id ? (
                                    <>
                                        <Button boxShadow="0px 8px 8px rgba(0, 0, 0, 0.25)" colorScheme="green" onClick={commitEdit}>Commit</Button>
                                        <Button boxShadow="0px 4px 4px rgba(0, 0, 0, 0.25)" colorScheme="orange" onClick={cancelEdit}>Cancel</Button>
                                    </>
                                ) : (
                                    <Button 
                                        colorScheme="blue" 
                                        onClick={() => edit(note.id, note.content, note.addenda)} 
                                        isDisabled={editId !== null && editId !== note.id}
                                        boxShadow="0px 4px 4px rgba(0, 0, 0, 0.25)"
                                    >
                                        Edit
                                    </Button>
                                )}
                                {editId === note.id && (
                                    <Button colorScheme="red" onClick={() => remove(note.id)}>Delete</Button>
                                )}
                            </HStack>
                        </HStack>
                    </Box>
                ))}
            </VStack>
            <Input 
                placeholder="Description" 
                value={content} 
                onChange={(e) => setContent(e.target.value)} 
                mt={4} 
            />
            <Button 
                colorScheme="blue" 
                onClick={handleNoteCreate} 
                mt={4}
            >
                {'Add Note'}
            </Button>
        </Box>
    </Box>
);
}

export default Notes;