import React, { Component } from 'react';
//import logo from './logo.svg';
import Customer from './components/Customer';
import CustomerAdd from './components/CustomerAdd';
import Table from '@material-ui/core/Table';
import TableHead from '@material-ui/core/TableHead';
import TableBody from '@material-ui/core/TableBody';
import TableRow from '@material-ui/core/TableRow';
import TableCell from '@material-ui/core/TableCell';
import { withStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import CircularProgress from '@material-ui/core/CircularProgress';
import './App.css';

const styles = (theme) => ({
  root: {
    width: '100%',
    marginTop: theme.spacing(3),
    overflowX: 'auto',
  },
  table: {
    minWidth: 1080,
  },
  progress: {
    margin: theme.spacing(2),
  },
});

class App extends Component {
  state = {
    customers: '',
    completed: 0,
  };
  // component가 mount 되고나면 실행해서 api 불러옴
  componentDidMount() {
    this.timer = setInterval(this.progress, 20);
    this.callApi()
      .then((res) => this.setState({ customers: res }))
      .catch((err) => console.log(err));
  }

  // api를 가져오는 비동기 함수. proxy 설정 port에서 가져옴
  callApi = async () => {
    const response = await fetch('/api/customers');
    const body = await response.json();
    return body;
  };

  progress = () => {
    const { completed } = this.state;
    this.setState({ completed: completed >= 100 ? 0 : completed + 1 });
  };

  render() {
    const { classes } = this.props; //style이 적용되게
    return (
      <div>
        <Paper className={classes.root}>
          <Table className={classes.table}>
            <TableHead>
              <TableRow>
                <TableCell key="1">번호</TableCell>
                <TableCell key="2">이미지</TableCell>
                <TableCell key="3">이름</TableCell>
                <TableCell key="4">생년월일</TableCell>
                <TableCell key="5">성별</TableCell>
                <TableCell key="6">직업</TableCell>
              </TableRow>
            </TableHead>

            {/* 처음에 비동기로 데이터 가져와서 */}
            {this.state.customers ? (
              this.state.customers.map((c) => {
                return (
                  <TableBody>
                    <Customer
                      key={c.id}
                      id={c.id}
                      image={c.image}
                      nm={c.nm}
                      birthday={c.birthday}
                      gender={c.gender}
                      job={c.job}
                    />
                  </TableBody>
                );
              })
            ) : (
              <TableRow>
                <TableCell colSpan="6" align="center">
                  <CircularProgress
                    className={classes.progress}
                    variant="determinate"
                    value={this.state.completed}
                  />
                </TableCell>
              </TableRow>
            )}
          </Table>
        </Paper>
        <CustomerAdd></CustomerAdd>
      </div>
    );
  }
}

export default withStyles(styles)(App);

/*
1. constructor()
2. compoentWillMount()
3. render()
4. componentDidMount()
*/
/*
props or state => shouldComponentUpdate() => render()
*/
