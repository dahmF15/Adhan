import './App.css'
import Button from '@mui/material/Button';
import Main from './comps/Main';
import Container from '@mui/material/Container';



function App() {

  return (
    <div style={{
      display:'flex',
      justifyContent:'center',
      backgroundColor:'#000',
      fontFamily:'Arial, sans-serif',
      color:'#fff',
      borderRadius: '10px 10px 15px 15px',
      height:'190vw'
    }}>
      <Container>
      <Main/>
      </Container>
    </div>
  )
}

export default App
