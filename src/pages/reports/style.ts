import styled from 'styled-components'

export const ReportsStyle = styled.main`
  .datePicker-Container {
    margin-top: 10px;
    display: flex;
    gap: 10px;
    justify-content: center;
  }

  .react-datepicker__input-container {
    display: flex;
    align-items: center;
  }

  .chart {
    display: flex;
    justify-content: center;
  }

  .react-datepicker__day,
  .react-datepicker__day-name {
    width: 32px;
    line-height: 32px;
    border-radius: 50%;
    margin: 2px;
  }

  .custom-datepicker {
    margin-top: 20px;

    .react-datepicker {
      width: 100%;
      border: none;
    }

    .react-datepicker__header {
      border: none;
      background-color: var(--color3);
    }

    .react-datepicker__day-names {
      display: flex;
      justify-content: space-around;
    }

    .react-datepicker__week {
      display: flex;
      justify-content: space-around;
    }

    .react-datepicker__month-container {
      width: 100%;
      background-color: var(--color3);

    }

    .react-datepicker__day {
      background-color: #f0f0f0;
      color: black;
      font-size: 16px;
    }

    .react-datepicker__day--selected {
      background-color: var(--color1); 
      color: white; 
    }

    .react-datepicker__day--today {
      font-weight: bold;
      border: 1px solid #4a90e2;
    }
  }
`
