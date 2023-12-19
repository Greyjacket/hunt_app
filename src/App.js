import { ChakraProvider, Flex } from '@chakra-ui/react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Notes from './components/Notes';
import LeadTable from './components/LeadTable';
import NavigationPane from './components/NavigationPane';
import LeadTableDisplay from './components/LeadTableDisplay';
import LeadList from './components/LeadList';

function App() {
  return (
    <ChakraProvider>
      <Router>
        <Flex direction={{ base: "column", md: "row" }}>
          <NavigationPane />
          <Routes>
            <Route path="/new-lead" element={<LeadTable className="table"/>} />
            <Route path="/leads/:id" element={<><LeadTableDisplay/><Notes/></>}/>
            <Route path="/current-leads" element={<LeadList/>} />  
            {/* Add more routes as needed */}
          </Routes>
        </Flex>
      </Router>
    </ChakraProvider>
  );
}

export default App;
