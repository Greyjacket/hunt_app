import React, { useState, useEffect } from 'react';
import {Flex, Box, FormControl, FormLabel, Input, Button, Grid, GridItem, Select, Text } from "@chakra-ui/react";
import { useParams } from 'react-router-dom';
import Notes from './Notes';

function LeadTableDisplay() {
    const { id } = useParams();

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
    const [isEditing, setIsEditing] = useState(false);
    const [tempTableData, setTempTableData] = useState(initialTableData);

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

    async function syncTable() {
        const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;
        const response = await fetch(`${API_BASE_URL}leads/${id}`);

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
    }

    useEffect(() => {
        syncTable();
    }, []);

    const handleInputChange = (event, field) => {
        const value = event.target.value;
        setTempTableData(prevTempTableData => {
            return {
                ...prevTempTableData,
                [field]: value
            };
        });
    };
    const handleSubmit = (event) => {
        event.preventDefault();
        const url = '`${API_BASE_URL}leads/${id}';
        fetch(url, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({'interest': tempTableData['interest']}),
        })
        .then(response => response.json())
        .then(data => {
            console.log('Success:', data);
            setIsEditing(false);
            syncTable(); // Fetch the latest data from the server
        })
        .catch((error) => {
            console.error('Error:', error);
        });
    };

    const handleEdit = () => {
        setTempTableData(tableData);
        setIsEditing(true);
    };

    const handleCancel = () => {
        setTempTableData(tableData);
        setIsEditing(false);
        syncTable(); // Reset the form to initial values
    };

    return (
        <div style={{ display: 'flex' }}>
            <Box as="form" onSubmit={handleSubmit} p={20} border="1px" borderColor="gray.200" borderRadius="sm" style={{ flex: 2 }}>
                <Box mb={5}><b>Created:</b> {new Date(tableData.date).toLocaleDateString()}</Box>
                <Grid templateColumns={{ base: "repeat(1, 1fr)", md: "repeat(2, 1fr)" }} gap={3}>
                    {labels.map((labelPair, index) => (
                        labelPair.map((label, subIndex) => (
                            <FormControl id={label} key={label} mb={4}>
                                <FormLabel>{label}</FormLabel>
                                <Text borderBottom="1px solid" borderColor="gray.200">{tableData[labels_map[index][subIndex]]}</Text>
                            </FormControl>
                        ))
                    ))}
                </Grid>
                <FormControl mt={4} display="flex" justifyContent="center">
                    {isEditing ? (
                        <Select placeholder="Select option" value={tempTableData['interest']} onChange={(e) => handleInputChange(e, 'interest')} required>
                            <option value="buying">Buying</option>
                            <option value="selling">Selling</option>
                        </Select>
                    ) : (
                        <Text borderBottom="1px solid" fontWeight="bold" borderColor="gray.200">Interest: {tableData['interest'].charAt(0).toUpperCase() + tableData['interest'].slice(1)}</Text>
                    )}
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
        </div>
    );
}

export default LeadTableDisplay;