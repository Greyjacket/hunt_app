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
    // return (
    //     <Box as="form" onSubmit={handleSubmit} p={5}>
    //     <Grid templateColumns={{ base: "repeat(1, 1fr)", md: "repeat(2, 1fr)" }} gap={6}>
    //         {Object.keys(initialTableData).map((field) => (
    //             <FormControl id={field} key={field} mb={4}>
    //                 <FormLabel>{field}</FormLabel>
    //                 {field === 'interest' ? (
    //                     <Select placeholder="Select option" value={tableData[field]} onChange={(e) => handleInputChange(e, field)} required>
    //                         <option value="">Select...</option>
    //                         <option value="option1">Buying</option>
    //                         <option value="option2">Selling</option>
    //                     </Select>
    //                 ) : (
    //                     <Input type="text" value={tableData[field]} onChange={(e) => handleInputChange(e, field)} />
    //                 )}
    //             </FormControl>
    //         ))}
    //         <Grid templateColumns="1fr" justifyContent="center">
    //             <Button colorScheme="blue" type="submit">Submit</Button>
    //         </Grid>
    //     </Grid>
    // </Box>
    // );
}

export default LeadTable;

// import React, { useState } from 'react';

// function LeadTable() {
//     const columns = Array(5).fill().map(() => Array(2).fill(''));

//     const initialTableData = {
//         seller: '',
//         buyer: '',
//         sellerNumber1: '',
//         buyerNumber1: '',
//         sellerNumber2: '',
//         buyerNumber2: '',
//         sellerEmail: '',
//         buyerEmail: '',
//         sellerAddress: '',
//         buyerAddress: '', 
//         interest: ''
//     };

//     const [tableData, setTableData] = useState(initialTableData);
//     const [date, setDate] = useState('');

//     const handleInputChange = (event, field) => {
//         const value = event.target.value;
//         setTableData(prevTableData => {
//           return {
//             ...prevTableData,
//             [field]: value
//           };
//         });
//     };

//     const handleSubmit = () => {
//         const url = 'http://127.0.0.1:8000/leads';
//         console.log(tableData)
//         fetch(url, {
//           method: 'POST',
//           headers: {
//             'Content-Type': 'application/json',
//           },
//           body: JSON.stringify(tableData),
//         })
//         .then(response => response.json())
//         .then(data => {
//           console.log('Success:', data);
//         })
//         .catch((error) => {
//           console.error('Error:', error);
//         });
//       };

//     const labels = [
//         ['Seller', 'Buyer'],
//         ['Seller Number 1', 'Buyer Number 1'],
//         ['Seller Number 2', 'Buyer Number 2'],
//         ['Seller Email', 'Buyer Email'],
//         ['Seller Address', 'Buyer Address']
//     ];    

//     const labels_map = [
//         ['seller', 'buyer'],
//         ['sellerNumber1', 'buyerNumber1'],
//         ['sellerNumber2', 'buyerNumber2'],
//         ['sellerEmail', 'buyerEmail'],
//         ['sellerAddress', 'buyerAddress']
//     ];  

//     const handleDateChange = (event) => {
//         setDate(event.target.value);
//     };

//     return (
//         <div className="tableContainer">
//         <label className="dateField">
//         Date:
//         <input
//           type="date"
//           value={date}
//           onChange={handleDateChange}
//           style={{textDecoration: 'underline'}}
//         />
//       </label> 
//       <table>
//         <thead>
//           <tr>
//             <th>Buyer</th>
//             <th>Seller</th>
//           </tr>
//         </thead>
//         <tbody>
//   {columns.map((row, rowIdx) => (
//     <tr key={rowIdx}>
//       {row.map((cell, colIdx) => (
//         <td key={colIdx}>
//           <label>
//             {labels[rowIdx][colIdx]}:
//             <input
//               type="text"
//               value={ tableData[labels_map[rowIdx][colIdx]]  }
//               onChange={event => handleInputChange(event, labels_map[rowIdx][colIdx])}
//             />
//           </label>
//         </td>
//       ))}
//     </tr>
//   ))}
// </tbody>
//       </table>
//       <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
//   <label className="dropdownLabel">
//     Interested In:
//     <select
//       value={tableData.interest} 
//       onChange={(event) => handleInputChange(event, 'interest')}
//     >
//       <option value="buying">Buying</option>
//       <option value="selling">Selling</option>
//     </select>
//   </label>
//   <button onClick={handleSubmit}>Submit</button>
// </div>
//   </div>
//     );
// }

// export default LeadTable;

// import React, { useState } from 'react';
// import { TextField, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Button, Select, MenuItem, InputLabel, FormControl } from '@mui/material';

// function LeadTable() {
//     const columns = Array(5).fill().map(() => Array(2).fill(''));

//     const initialTableData = {
//         seller: '',
//         buyer: '',
//         sellerNumber1: '',
//         buyerNumber1: '',
//         sellerNumber2: '',
//         buyerNumber2: '',
//         sellerEmail: '',
//         buyerEmail: '',
//         sellerAddress: '',
//         buyerAddress: '', 
//         interest: ''
//     };

//     const [tableData, setTableData] = useState(initialTableData);
//     const [date, setDate] = useState('');

//     const handleInputChange = (event, field) => {
//         const value = event.target.value;
//         setTableData(prevTableData => {
//           return {
//             ...prevTableData,
//             [field]: value
//           };
//         });
//     };

//     const handleSubmit = () => {
//         const url = 'http://127.0.0.1:8000/leads';
//         console.log(tableData)
//         fetch(url, {
//           method: 'POST',
//           headers: {
//             'Content-Type': 'application/json',
//           },
//           body: JSON.stringify(tableData),
//         })
//         .then(response => response.json())
//         .then(data => {
//           console.log('Success:', data);
//         })
//         .catch((error) => {
//           console.error('Error:', error);
//         });
//       };

//     const labels = [
//         ['Seller', 'Buyer'],
//         ['Seller Number 1', 'Buyer Number 1'],
//         ['Seller Number 2', 'Buyer Number 2'],
//         ['Seller Email', 'Buyer Email'],
//         ['Seller Address', 'Buyer Address']
//     ];    

//     const labels_map = [
//         ['seller', 'buyer'],
//         ['sellerNumber1', 'buyerNumber1'],
//         ['sellerNumber2', 'buyerNumber2'],
//         ['sellerEmail', 'buyerEmail'],
//         ['sellerAddress', 'buyerAddress']
//     ];  

//     const handleDateChange = (event) => {
//         setDate(event.target.value);
//     };

//     return (
//         <div>
//  <TableContainer>
//     <Table>
//       <TableHead>
//         <TableRow>
//           <TableCell>Buyer</TableCell>
//           <TableCell>Seller</TableCell>
//         </TableRow>
//       </TableHead>
//       <TableBody>
//         {columns.map((row, rowIdx) => (
//           <TableRow key={rowIdx}>
//             {row.map((cell, colIdx) => (
//               <TableCell key={colIdx}>
//                 <InputLabel>{labels[rowIdx][colIdx]}:</InputLabel>
//                 <TextField
//                   value={tableData[labels_map[rowIdx][colIdx]]}
//                   onChange={event => handleInputChange(event, labels_map[rowIdx][colIdx])}
//                 />
//               </TableCell>
//             ))}
//           </TableRow>
//         ))}
//       </TableBody>
//     </Table>
//   </TableContainer>
//  <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
//  <FormControl>
//    <InputLabel>Interested In:</InputLabel>
//    <Select
//      value={tableData.interest}
//      onChange={(event) => handleInputChange(event, 'interest')}
//    >
//      <MenuItem value="buying">Buying</MenuItem>
//      <MenuItem value="selling">Selling</MenuItem>
//    </Select>
//  </FormControl>
//  <Button variant="contained" color="primary" onClick={handleSubmit}>Submit</Button>
// </div>
// </div>

//     );
//   }

// export default LeadTable;