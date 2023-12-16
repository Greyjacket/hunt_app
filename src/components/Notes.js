import React, { useState } from 'react';
import { Box, Heading, Button, Input, VStack, HStack, Text, Textarea } from '@chakra-ui/react';
import './Notes.css';

function Notes() {
    const [des, setDes] = useState("");
    const [notes, setNotes] = useState([]);
    const [count, setCount] = useState(0);
    const [editKey, setEditKey] = useState(null);
    const [addendum, setAddendum] = useState("");
    const [editAddendumKey, setEditAddendumKey] = useState(null);
    const [showAddAddendum, setShowAddAddendum] = useState(false);
    const [showAddAddendumButton, setShowAddAddendumButton] = useState(true);
    const [tempNote, setTempNote] = useState(null);
    const [tempAddendum, setTempAddendum] = useState(null);

    function handleNoteCreate() {
        const date = new Date();
        if (editKey !== null) {
            setNotes(notes.map(note => note.key === editKey ? { key: editKey, date: date.toLocaleDateString(), des: des, addenda: note.addenda } : note));
            setEditKey(null);
        } else {
            if (des.trim() === '') {
                alert('Note text cannot be empty!');
                return;
            }            
            setNotes([...notes, { key: count, date: date.toLocaleDateString(), des: des, addenda: [] }]);
            setCount(count + 1);

        }
        setDes("");
    }

    function edit(key, des) {
        setEditKey(key);
        setTempNote({ key, des });
    }

    function remove(id) {
        setNotes(notes.filter((e) => e.key !== id));
    }

    function addAddendum(id) {
        const addendaKey = Date.now();
        setNotes(notes.map(note => note.key === id ? { ...note, addenda: [...note.addenda, { key: addendaKey, text: addendum }] } : note));
        setAddendum("");
        setShowAddAddendum(false);
    }

    function editAddendum(noteId, addendumKey, text) {
        setTempAddendum({ noteId, addendumKey, text });
        setEditAddendumKey({ noteId, addendumKey });
    }

    function handleAddendum() {
        if (editAddendumKey !== null) {
            setNotes(notes.map(note => note.key === editAddendumKey.noteId ? { ...note, addenda: note.addenda.map(addendum => addendum.key === editAddendumKey.addendumKey ? { key: editAddendumKey.addendumKey, text: tempAddendum.text } : addendum) } : note));
            setEditAddendumKey(null);
            setTempAddendum(null);
        } else {
            addAddendum(editKey);
        }
        setAddendum("");
        setShowAddAddendumButton(true);

    }

    function handleEditChange(key, value) {
        // Find the note with the given key and update its description
        const updatedNotes = notes.map(note => note.key === key ? { ...note, des: value } : note);
        setNotes(updatedNotes);
    }

    function cancelEdit() {
        setEditKey(null);
        setEditAddendumKey(null);
        setShowAddAddendum(false);
        setTempNote(null);
        setAddendum("");
        setShowAddAddendumButton(true);
        setTempAddendum(null);
    }

    function saveAddendumEdit() {
        setNotes(notes.map(note => note.key === editAddendumKey.noteId ? { ...note, addenda: note.addenda.map(addendum => addendum.key === editAddendumKey.addendumKey ? { key: editAddendumKey.addendumKey, text: tempAddendum.text } : addendum) } : note));
        setEditAddendumKey(null);
        setTempAddendum(null);
    }

    function cancelAddendumEdit() {
        setEditAddendumKey(null);
        setTempAddendum(null);
    }

    function commitEdit() {
        const updatedNotes = notes.map(note => note.key === tempNote.key ? { ...note, des: tempNote.des } : note);
        setNotes(updatedNotes);
        setEditKey(null);
        setShowAddAddendum(false);
        setTempNote(null);
        setShowAddAddendumButton(true);
        setEditAddendumKey(null);
    }

    function removeAddendum(noteId, addendumKey) {
        setNotes(notes.map(note => note.key === noteId ? { ...note, addenda: note.addenda.filter(addendum => addendum.key !== addendumKey) } : note));
    }

    return (
    <Box className="App" p={5} w="50%">
        <Box className="card" border="1px" borderColor="gray.200" borderRadius="md" p={5}>
            <Box className="head">
                <Heading fontSize="lg" textAlign="center" mb={4}>Notes</Heading>
            </Box>
            <VStack spacing={4} className="notes">
                {notes.map((e) => (
                    <Box 
                        key={e.key} 
                        w="100%" 
                        p={4} 
                        border="1px" 
                        borderColor="gray.200" 
                        borderRadius="md" 
                        _hover={{ bg: "gray.100" }} 
                        className="note-container"
                    >
                        <HStack justifyContent="space-between" alignItems="center">
                            <VStack align="start" w="90%">
                                <Text>{e.date}</Text>
                                {editKey === e.key ? (
                                    <Input 
                                        w="100%" 
                                        value={tempNote.des} 
                                        onChange={(event) => setTempNote({ ...tempNote, des: event.target.value })}
                                    />
                                ) : (
                                    <Text>{e.des}</Text>
                                )}
                                {e.addenda.map((addendum, index) => (
                                    <HStack key={addendum.key}>
                                        {editAddendumKey !== null && editAddendumKey.addendumKey === addendum.key ? (
                                            <Input 
                                                value={tempAddendum.text} 
                                                onChange={(event) => setTempAddendum({ ...tempAddendum, text: event.target.value })}
                                            />
                                        ) : (
                                            <Text ml={5} fontSize="sm">- {addendum.text}</Text>
                                        )}
                                        {editKey === e.key && (
                                            <>
                                                <Button 
                                                    size="xs" 
                                                    onClick={() => editAddendum(e.key, addendum.key, addendum.text)} 
                                                    isDisabled={editAddendumKey !== null && editAddendumKey.addendumKey !== addendum.key}
                                                >
                                                    Edit
                                                </Button>
                                                {editAddendumKey !== null && editAddendumKey.addendumKey === addendum.key && (
                                                    <>
                                                        <Button size="xs" onClick={saveAddendumEdit}>Save</Button>
                                                        <Button size="xs" onClick={cancelAddendumEdit}>Cancel</Button>
                                                    </>
                                                )}
                                                <Button size="xs" onClick={() => removeAddendum(e.key, addendum.key)}>Delete</Button>
                                            </>
                                        )}
                                    </HStack>
                                ))}
                                {editKey === e.key && (
                                    <>
                                        {showAddAddendum && (
                                            <HStack spacing={4}>
                                                <Textarea 
                                                    placeholder="Addendum text here" 
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
                                {editKey === e.key && showAddAddendumButton && (
                                    <Button 
                                        colorScheme="blue" 
                                        onClick={() => { setShowAddAddendum(true); setShowAddAddendumButton(false); }}
                                    >
                                        Addendum
                                    </Button>
                                )}
                                {editKey === e.key ? (
                                    <>
                                        <Button colorScheme="green" onClick={commitEdit}>Commit</Button>
                                        <Button colorScheme="orange" onClick={cancelEdit}>Cancel</Button>
                                    </>
                                ) : (
                                    <Button 
                                        colorScheme="blue" 
                                        onClick={() => edit(e.key, e.des)} 
                                        isDisabled={editKey !== null && editKey !== e.key}
                                    >
                                        Edit
                                    </Button>
                                )}
                                {editKey === e.key && (
                                    <Button colorScheme="red" onClick={() => remove(e.key)}>Delete</Button>
                                )}
                            </HStack>
                        </HStack>
                    </Box>
                ))}
            </VStack>
            <Input 
                placeholder="Description" 
                value={des} 
                onChange={(e) => setDes(e.target.value)} 
                mt={4} 
            />
            <Button 
                colorScheme="blue" 
                onClick={handleNoteCreate} 
                mt={4}
            >
                {editKey !== null ? 'Update Note' : 'Add Note'}
            </Button>
        </Box>
    </Box>
);
}

export default Notes;