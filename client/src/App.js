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

import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import InputBase from '@material-ui/core/InputBase';
import { alpha, makeStyles } from '@material-ui/core/styles';
import MenuIcon from '@material-ui/icons/Menu';
import SearchIcon from '@material-ui/icons/Search';

const styles = (theme) => ({
  root: {
    width: '100%',
    minWidth: 1080,
    // 페이지 스크롤 바가 전체로 안먹어서
  },
  menu: {
    marginTop: 15,
    marginBottom: 15,
    display: 'flex',
    justifyContent: 'center',
  },
  paper: {
    marginLeft: 18,
    marginRight: 18,
  },
  table: {
    minWidth: 1080,
  },
  progress: {
    margin: theme.spacing(2),
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
  title: {
    flexGrow: 1,
    display: 'none',
    [theme.breakpoints.up('sm')]: {
      display: 'block',
    },
  },
  search: {
    position: 'relative',
    borderRadius: theme.shape.borderRadius,
    backgroundColor: alpha(theme.palette.common.white, 0.15),
    '&:hover': {
      backgroundColor: alpha(theme.palette.common.white, 0.25),
    },
    marginLeft: 0,
    width: '100%',
    [theme.breakpoints.up('sm')]: {
      marginLeft: theme.spacing(1),
      width: 'auto',
    },
  },
  searchIcon: {
    padding: theme.spacing(0, 2),
    height: '100%',
    position: 'absolute',
    pointerEvents: 'none',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  inputRoot: {
    color: 'inherit',
  },
  inputInput: {
    padding: theme.spacing(1, 1, 1, 0),
    // vertical padding + font size from searchIcon
    paddingLeft: `calc(1em + ${theme.spacing(4)}px)`,
    transition: theme.transitions.create('width'),
    width: '100%',
    [theme.breakpoints.up('sm')]: {
      width: '12ch',
      '&:focus': {
        width: '20ch',
      },
    },
  },
  tableHead: {
    fontSize: '1.0rem',
  },
});

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      customers: '',
      completed: 0,
      searchKeyword: '',
    };
  }

  //고객데이터 state 초기화 → callApi로 고객 list 새로 불러옴
  stateRefresh = () => {
    this.setState({
      customers: '',
      completed: 0,
      searchKeyword: '',
    });
    this.callApi()
      .then((res) => this.setState({ customers: res }))
      .catch((err) => console.log(err));
  };

  // component가 mount 되고나면 실행해서 api(고객목록) 불러옴
  componentDidMount() {
    this.timer = setInterval(this.progress, 20);
    this.callApi()
      .then((res) => this.setState({ customers: res }))
      .catch((err) => console.log(err));
  }

  // api(고객목록)를 가져오는 비동기 함수. proxy 설정 port에서 가져옴
  callApi = async () => {
    const response = await fetch('/api/customers');
    const body = await response.json();
    return body;
  };

  progress = () => {
    const { completed } = this.state;
    this.setState({ completed: completed >= 100 ? 0 : completed + 1 });
  };
  // 서치기능 만드는중 변화 감지 함수 handleValue 함수와 유사
  handleValueChange = (e) => {
    let nextState = {};
    nextState[e.target.name] = e.target.value;
    this.setState(nextState);
  };

  render() {
    const filteredComponents = (data) => {
      data = data.filter((c) => {
        // console.log(c); 근데 nm을 name으로 바꾸면 왜 안됨
        return c.nm.indexOf(this.state.searchKeyword) > -1;
      });
      return data.map((c) => {
        return (
          <Customer
            stateRefresh={this.stateRefresh}
            key={c.id}
            id={c.id}
            image={c.image}
            nm={c.nm}
            birthday={c.birthday}
            gender={c.gender}
            job={c.job}
          />
        );
      });
    };
    const { classes } = this.props; //style이 적용되게
    const cellList = [
      '번호',
      '이미지',
      '이름',
      '생년월일',
      '성별',
      '직업',
      '설정',
    ];
    return (
      <div className={classes.root}>
        <AppBar position="static">
          <Toolbar>
            <IconButton
              edge="start"
              className={classes.menuButton}
              color="inherit"
              aria-label="open drawer"
            >
              <MenuIcon />
            </IconButton>
            <Typography className={classes.title} variant="h6" noWrap>
              고객 관리 시스템
            </Typography>
            <div className={classes.search}>
              <div className={classes.searchIcon}>
                <SearchIcon />
              </div>
              <InputBase
                placeholder="검색하기"
                classes={{
                  root: classes.inputRoot,
                  input: classes.inputInput,
                }}
                name="searchKeyword" //검색창 입력 키워드를 이 속성으로 관리
                value={this.state.searchKeyword} //저장되어있는 상태값 위 키워드 받고
                onChange={this.handleValueChange} // 값이 변경되면 이 함수를 부름 → state값을 변경값으로 변경 → valus 출력
                // inputProps={{ 'aria-label': 'search' }}
              />
            </div>
          </Toolbar>
        </AppBar>

        {/* 고객추가하기 버튼 */}
        <div className={classes.menu}>
          <CustomerAdd stateRefresh={this.stateRefresh}></CustomerAdd>
        </div>

        <Paper className={classes.paper}>
          {/* 데이터 테이블 */}
          <Table className={classes.table}>
            <TableHead>
              <TableRow>
                {cellList.map((c) => {
                  return (
                    <TableCell className={classes.tableHead}>{c}</TableCell>
                  );
                })}
              </TableRow>
            </TableHead>

            {/* Body(Customer cpnt) > Row > Cell 처음에 비동기로 데이터 가져와서 */}
            <TableBody>
              {this.state.customers ? (
                filteredComponents(this.state.customers)
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
            </TableBody>
          </Table>
        </Paper>
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
