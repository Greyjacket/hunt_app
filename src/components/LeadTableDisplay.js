import React, { useState, useEffect } from 'react';
import { Box, FormControl, FormLabel, Input, Button, Grid, Select, Text } from "@chakra-ui/react";

function LeadTableDisplay() {
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
    const [isEditing, setIsEditing] = useState(false);


    async function syncTable() {
        const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;
        const response = await fetch(`${API_BASE_URL}leads/1`);

        if (!response.ok) {
            console.error(`Failed to fetch notes: ${response.status}`);
            return;
        }
        const data = await response.json();
        const { buyer, seller, interest, created_at } = data;

        const {
            name: buyerName,
            email: buyerEmail,
            phone1: buyerPhone1,
            phone2: buyerPhone2,
            address: buyerAddress
        } = buyer;

        const {
            name: sellerName,
            email: sellerEmail,
            phone1: sellerPhone1,
            phone2: sellerPhone2,
            address: sellerAddress
        } = seller;

        setTableData(prevTableData => ({
            ...prevTableData,
            buyer: buyerName,
            buyerEmail: buyerEmail,
            buyerNumber1: buyerPhone1,
            buyerNumber2: buyerPhone2,
            buyerAddress: buyerAddress,
            seller: sellerName,
            sellerEmail: sellerEmail,
            sellerNumber1: sellerPhone1,
            sellerNumber2: sellerPhone2,
            sellerAddress: sellerAddress,
            interest: interest,
            date: created_at
        }));        
        
        setTableData(data);
    }

    useEffect(() => {
        syncTable();
    }, []);
    
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
        const url = 'http://127.0.0.1:8000/leads';
        fetch(url, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(tableData),
        })
        .then(response => response.json())
        .then(data => {
          console.log('Success:', data);
        })
        .catch((error) => {
          console.error('Error:', error);
        });
    };

    const handleEdit = () => {
        setIsEditing(true);
    };

    const handleCancel = () => {
        setIsEditing(false);
        syncTable(); // Reset the form to initial values
    };

    return (
        <Box as="form" onSubmit={handleSubmit} p={20} border="1px" borderColor="gray.200" borderRadius="sm">
            <Box mb={4}>{currentDate}</Box>
            <Grid templateColumns={{ base: "repeat(1, 1fr)", md: "repeat(2, 1fr)" }} gap={3}>
                {labels.map((labelPair, index) => (
                    labelPair.map((label, subIndex) => (
                        <FormControl id={label} key={label} mb={4}>
                            <FormLabel>{label}</FormLabel>
                            {isEditing ? (
                                <Input type="text" value={tableData[labels_map[index][subIndex]]} onChange={(e) => handleInputChange(e, labels_map[index][subIndex])} />
                            ) : (
                                <Text borderBottom="1px solid" borderColor="gray.200">{tableData[labels_map[index][subIndex]]}</Text>
                            )}
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
            {!isEditing ? (
                <Button colorScheme="blue" mt={4} display="block" mx="auto" width="66%" onClick={handleEdit}>Edit</Button>
            ) : (
                <>
                    <Button colorScheme="blue" type="submit" mt={4} display="block" mx="auto" width="66%">Update</Button>
                    <Button colorScheme="red" mt={4} display="block" mx="auto" width="66%" onClick={handleCancel}>Cancel</Button>
                </>
            )}        
        </Box>
    );
}

export default LeadTableDisplay;