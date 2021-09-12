import React, { Component } from 'react';
import { post } from 'axios';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import { withStyles } from '@material-ui/core/styles';
//import { render } from 'react-dom';

const styles = (theme) => ({
  hidden: {
    display: 'none',
  },
});

class CustomerAdd extends Component {
  constructor(props) {
    super(props);
    this.state = {
      file: null,
      userName: '',
      birthday: '',
      gender: '',
      job: '',
      fileName: '',
      open: false,
      // 현재 dialog창이 열려 있는지 확인
    };
  }

  // submit버튼 → addCustomer함수 → post data → /api/customers
  handleFormSubmit = (e) => {
    e.preventDefault();
    this.addCustomer().then((response) => {
      // console.log(response.data);
      this.props.stateRefresh();
      //고객데이터 추가 → 고객데이터 불러옴 : 비동기라 이 순서 보장 못해서 여기 위치
    });
    this.setState({
      file: null,
      userName: '',
      birthday: '',
      gender: '',
      job: '',
      fileName: '',
      open: false,
    });
  };
  //file값 변경 → fn → file 자체, file명 입력

  handleFileChange = (e) => {
    this.setState({
      file: e.target.files[0],
      fileName: e.target.value,
    });
  };
  // 입력란에 값 입력되게하고, 보여지게 하는 함수
  handleValueChange = (e) => {
    let nextState = {};
    nextState[e.target.name] = e.target.value;
    this.setState(nextState);
  };

  // 추가된 data를 post에 담는 함수
  addCustomer = () => {
    const url = '/api/customers';
    const formData = new FormData();
    formData.append('image', this.state.file);
    formData.append('name', this.state.userName);
    formData.append('birthday', this.state.birthday);
    formData.append('gender', this.state.gender);
    formData.append('job', this.state.job);
    const config = {
      headers: {
        'content-type': 'multipart/form-data',
      },
      //파일포함된 경우 넣어줌 멀티파트
    };
    return post(url, formData, config);
  };

  handleClickOpen = () => {
    this.setState({
      open: true,
    });
  };
  // 현재 popup창이 안뜨게
  handleClickClose = () => {
    this.setState({
      open: true,
    });
    this.setState({
      file: null,
      userName: '',
      birthday: '',
      gender: '',
      job: '',
      fileName: '',
      open: false,
    });
  };

  render() {
    const { classes } = this.props;
    return (
      <div>
        <Button
          variant="contained"
          color="primary"
          onClick={this.handleClickOpen}
        >
          고객 추가하기
        </Button>

        <br />
        <Dialog open={this.state.open} onClose={this.handleClickClose}>
          <DialogTitle>고객추가</DialogTitle>
          <DialogContent>
            <input
              className={classes.hidden} //hidden 속성 이용 입력값 자체 안보이게
              accept="image/*" //only image만 가능하게
              id="raised-button-file"
              type="file"
              file={this.state.file}
              value={this.state.fileName}
              onChange={this.handleFileChange}
            />
            <label htmlFor="raised-button-file">
              <Button
                //위에 input을 여기 button을 통해
                variant="contained"
                color="primary"
                component="span"
                name="file"
                // 실제로 전송되는 file 내용을 버튼의 속성으로(name="file")
              >
                {this.state.fileName === ''
                  ? '프로필 이미지 선택'
                  : this.state.fileName}
              </Button>
            </label>
            <br />
            <TextField
              label="이름"
              type="text"
              name="userName"
              value={this.state.userName}
              onChange={this.handleValueChange}
            />
            <br />
            <TextField
              label="생년월일"
              type="text"
              name="birthday"
              value={this.state.birthday}
              onChange={this.handleValueChange}
            />
            <br />
            <TextField
              label="성별"
              type="text"
              name="gender"
              value={this.state.gender}
              onChange={this.handleValueChange}
            />
            <br />
            <TextField
              label="직업"
              type="text"
              name="job"
              value={this.state.job}
              onChange={this.handleValueChange}
            />
            <br />
          </DialogContent>
          <DialogActions>
            <Button
              variant="contained"
              color="primary"
              onClick={this.handleFormSubmit}
            >
              추가
            </Button>
            <Button
              variant="outlined"
              color="primary"
              onClick={this.handleClickClose}
            >
              닫기
            </Button>
          </DialogActions>
        </Dialog>
      </div>
      /*
      <form onSubmit={this.handleFormSubmit}>
        <h1>고객 추가</h1>
        프로필 이미지 :{' '}
        <TextField
          type="file"
          name="file"
          file={this.state.file}
          value={this.state.fileName}
          onChange={this.handleFileChange}
        />
        <br />
        이름 :{' '}
        <TextField
          type="text"
          name="userName"
          value={this.state.userName}
          onChange={this.handleValueChange}
        />
        <br />
        생년월일 :{' '}
        <TextField
          type="text"
          name="birthday"
          value={this.state.birthday}
          onChange={this.handleValueChange}
        />
        <br />
        성별 :{' '}
        <TextField
          type="text"
          name="gender"
          value={this.state.gender}
          onChange={this.handleValueChange}
        />
        <br />
        직업 :{' '}
        <TextField
          type="text"
          name="job"
          value={this.state.job}
          onChange={this.handleValueChange}
        />
        <br />
        <button type="submit">추가하기</button>
      </form>
      */
    );
  }
}
export default withStyles(styles)(CustomerAdd);
//  const { classes } = this.props; 이거땜에 위드스타일
