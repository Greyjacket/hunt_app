import React, { useState } from 'react';
import { Box, FormControl, FormLabel, Input, Button, Grid, Select, Modal, ModalOverlay, ModalContent, ModalHeader, ModalCloseButton, ModalBody, ModalFooter} from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";

function LeadTable() {
    const navigate = useNavigate();

    const initialTableData = {
        seller: '',
        buyer: '',
        sellerNumber1: '',
        buyerNumber1: '',
        sellerNumber2: '',
        buyerNumber2: '',
        sellerEmail: '',
        buyerEmail: '',
        sellerAddress: '',
        buyerAddress: '', 
        interest: '', 
        date: ''
    };


    const [tableData, setTableData] = useState(initialTableData);
    const currentDate = new Date().toLocaleDateString();
    const [isErrorOpen, setIsErrorOpen] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");

    const labels = [
        ['Seller', 'Buyer'],
        ['Seller Number 1', 'Buyer Number 1'],
        ['Seller Number 2', 'Buyer Number 2'],
        ['Seller Email', 'Buyer Email'],
        ['Seller Address', 'Buyer Address']
    ];  
    
    const labels_map = [
        ['seller', 'buyer'],
        ['sellerNumber1', 'buyerNumber1'],
        ['sellerNumber2', 'buyerNumber2'],
        ['sellerEmail', 'buyerEmail'],
        ['sellerAddress', 'buyerAddress']
    ];  

    const handleInputChange = (event, field) => {
        const value = event.target.value;
        setTableData(prevTableData => {
          return {
            ...prevTableData,
            [field]: value
          };
        });
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

        const url = `${API_BASE_URL}leads/`;
        fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(tableData),
        })
        .then(response => {
            if (!response.ok) {
                if (response.status >= 500) {
                    setErrorMessage('Server error');
                } else {
                    return response.json().then(error => {
                        setIsErrorOpen(true);
                        setErrorMessage(`Error: ${error.detail}`);
                    });
                }
                return;
            }
            return response.json();
        })
        .then(data => {
            navigate(`/leads/${data.id}`);
        })
        .catch((error) => {
            console.error('Error:', error);
        });
    };

    return (
    <div>
    <Box as="form" onSubmit={handleSubmit} p={10} border="1px" borderColor="gray.200" borderRadius="sm">
        <Box mb={4}>{currentDate}</Box>
        <Grid templateColumns={{ base: "repeat(1, 1fr)", md: "repeat(2, 1fr)" }} gap={2}>
            {labels.map((labelPair, index) => (
                labelPair.map((label, subIndex) => (
                    <FormControl id={label} key={label} mb={4}>
                        <FormLabel>{label}</FormLabel>
                        <Input type="text" value={tableData[labels_map[index][subIndex]]} onChange={(e) => handleInputChange(e, labels_map[index][subIndex])} required={label === 'Seller' || label === 'Buyer'}/>
                    </FormControl>
                ))
            ))}
        </Grid>
        <FormControl mt={4} display="flex" justifyContent="center">
            <Select placeholder="Select option" value={tableData['interest']} onChange={(e) => handleInputChange(e, 'interest')} required>
                <option value="buying">Buying</option>
                <option value="selling">Selling</option>
            </Select>
        </FormControl>
        <Button colorScheme="blue" type="submit" mt={4} display="block" mx="auto" width="66%">Submit</Button>
    </Box>
    <Modal isOpen={isErrorOpen} onClose={() => setIsErrorOpen(false)}>
            <ModalOverlay />
            <ModalContent>
                <ModalHeader>Error</ModalHeader>
                <ModalCloseButton />
                <ModalBody>
                    {errorMessage}
                </ModalBody>
                <ModalFooter>
                    <Button colorScheme="blue" onClick={() => setIsErrorOpen(false)}>Close</Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    </div>
    );
}

export default LeadTable;
