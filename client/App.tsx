import { Box } from '@chakra-ui/layout';
import {
  BrowserRouter as Router,
  Redirect,
  Route,
  Switch
} from 'react-router-dom';
import Home from './pages/home';

export const App: React.FC = ({}) => {
  return (
    <Box as="main" minH="100vh" backgroundColor="blue.200" p={8} py={24}>
      <Router>
        <Switch>
          <Route path="/" exact component={Home} />
        </Switch>
      </Router>
    </Box>
  );
};
