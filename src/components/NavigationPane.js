import { Box, VStack } from '@chakra-ui/react';
import { Link } from 'react-router-dom';

function NavigationPane() {
    return (
        <Box borderRight="1px" borderColor="blue.200" p={5}>
            <VStack align="start" spacing={4}>
                <Link to="/new-lead">New Lead</Link>
                <Link to="/current-leads">Current Leads</Link>
            </VStack>
        </Box>
    );
}

export default NavigationPane;