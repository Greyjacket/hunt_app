import React, { useState, useEffect } from 'react';
import { Box, Table, Thead, Tbody, Tr, Th, Td } from "@chakra-ui/react";
import { Link } from 'react-router-dom';
import { useNavigate } from "react-router-dom";
import { Icon, Flex, Text } from "@chakra-ui/react";
import { AiOutlinePlusCircle } from "react-icons/ai";

function LeadsList() {
    const [tableData, setTableData] = useState([]);
    const navigate = useNavigate();
    let columns = ["ID", "Interest", "Date", "Buyer Name", "Buyer Email", "Buyer Phone 1", "Buyer Phone 2", "Buyer Address", "Seller Name", "Seller Email", "Seller Phone 1", "Seller Phone 2", "Seller Address"]

    async function syncTable() {
        const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;
        const response = await fetch(`${API_BASE_URL}leads`);

        if (!response.ok) {
            console.error(`Failed to fetch leads: ${response.status}`);
            return;
        }
        const data = await response.json();
        const flattenedLeads = data.map((lead) => {
            return {
                interest: lead.interest,
                id: lead.id,
                date: lead.created_at,
                buyer_name: lead.buyer.name,
                buyer_email: lead.buyer.email,
                buyer_phone1: lead.buyer.phone1,
                buyer_phone2: lead.buyer.phone2,
                buyer_address: lead.buyer.address,
                seller_name: lead.seller.name,
                seller_email: lead.seller.email,
                seller_phone1: lead.seller.phone1,
                seller_phone2: lead.seller.phone2,
                seller_address: lead.seller.address,
            };
        });
        setTableData(flattenedLeads);
    }

    useEffect(() => {
        syncTable();
    }, []);

    const handleRowClick = (id) => {
        navigate(`/leads/${id}`);
    };

    return (
        <div>
            <Box maxW="15%" _hover={{ backgroundColor: "blue.100" }}>
                <Link to="/new-lead">
                    <Flex align="center">
                        <Icon as={AiOutlinePlusCircle} boxSize={10} color="blue.500" />
                        <Text fontSize="xl" fontWeight="bold" ml={2}>Create new lead</Text>
                    </Flex>
                </Link>
            </Box>
            <Table variant="simple">
                <Thead>
                    <Tr>
                        {columns.map((column, index) => (
                            <Th key={index}>{column}</Th>
                        ))}
                    </Tr>
                </Thead>
                <Tbody>
                    {tableData.map((row, index) => (
                        <Box as="tr" key={index} onClick={() => handleRowClick(row.id)} _hover={{ boxShadow: "0 0 10px #719ECE", cursor: "pointer" }}>
                            <Td>{row.id || "N/A"}</Td>
                            <Td>{row.interest || "N/A"}</Td>
                            <Td>{new Date(row.date).toLocaleDateString() || "N/A"}</Td>
                            <Td>{row.buyer_name || "N/A"}</Td>
                            <Td>{row.buyer_email || "N/A"}</Td>
                            <Td>{row.buyer_phone1 || "N/A"}</Td>
                            <Td>{row.buyer_phone2 || "N/A"}</Td>
                            <Td>{row.buyer_address || "N/A"}</Td>
                            <Td>{row.seller_name || "N/A"}</Td>
                            <Td>{row.seller_email || "N/A"}</Td>
                            <Td>{row.seller_phone1 || "N/A"}</Td>
                            <Td>{row.seller_phone2 || "N/A"}</Td>
                            <Td>{row.seller_address || "N/A"}</Td>
                        </Box>
                    ))}
                </Tbody>
            </Table>
        </div>
    );
}

export default LeadsList;