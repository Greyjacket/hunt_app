import { Box, VStack } from '@chakra-ui/react';
import { Link } from 'react-router-dom';

function NavigationPane() {
    return (
        <Box borderRight="1px" borderColor="blue.200" p={5}>
            <VStack align="start" spacing={4}>
                <Link to="/new-lead">New Lead</Link>
                <Link to="/current-leads">Current Leads</Link>
                <Link to="/link-3">Link 3</Link>
                <Link to="/link-4">Link 4</Link>
            </VStack>
        </Box>
    );
}

export default NavigationPane;