import React, { useState } from 'react';
import { Box, FormControl, FormLabel, Input, Button, Grid, Select, Flex, Spacer } from "@chakra-ui/react";

function LeadTable() {
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
    const [date, setDate] = useState('');
    const currentDate = new Date().toLocaleDateString();

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
        console.log(tableData)
        fetch(url, {
          method: 'POST',
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

    return (
        <Box as="form" onSubmit={handleSubmit} p={20} border="1px" borderColor="gray.200" borderRadius="sm">
        <Box mb={4}>{currentDate}</Box>
        <Grid templateColumns={{ base: "repeat(1, 1fr)", md: "repeat(2, 1fr)" }} gap={3}>
            {labels.map((labelPair, index) => (
                labelPair.map((label, subIndex) => (
                    <FormControl id={label} key={label} mb={4}>
                        <FormLabel>{label}</FormLabel>
                        <Input type="text" value={tableData[labels_map[index][subIndex]]} onChange={(e) => handleInputChange(e, labels_map[index][subIndex])} />
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
    );
}

export default LeadTable;
