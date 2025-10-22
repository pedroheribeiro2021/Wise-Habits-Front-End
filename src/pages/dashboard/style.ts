import styled from 'styled-components'

export const DashboardStyle = styled.main`
  display: flex;
  flex-direction: column;
  align-items: center;
  .date_container {
    display: flex;
    justify-content: center;
    align-items: center;
    .center {
      text-align: center;
    }
    button {
      border-radius: 50%;
      height: 50px;
      width: 50px;
      background-color: var(--color2);
      display: flex;
      margin-right: 5px;
      /* align-content: center; */
      justify-content: center;
      align-items: center;
    }
  }
  ul {
    margin-top: 10px;
    display: flex;
    /* margin: 0 auto; */
    flex-direction: column;
    gap: 10px;
  }
  li {
    width: 380px;
    padding: 10px;
    border-radius: 6px;
  }
  .header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    span {
      margin-right: 5px;
    }
  }

  .name_icon {
    display: flex;
    align-items: center;
  }

  .habit_card {
    /* border: 1px solid red; */
    background-color: var(--color1);
    p {
      margin: 8px 0;
    }
  }

  .status {
    margin-top: 8px;
    display: flex;
    font-size: 12px;
    justify-content: space-between;
  }
  .status_container {
    /* border: 1px solid black; */
    display: flex;
    flex-direction: column;
    gap: 5px;
  }
  .add_button {
    background-color: var(--color2);
    color: white;
    font-size: 20px;
    border-radius: 50%;
    height: 50px;
    width: 50px;
  }
`
