import ReactModal from 'react-modal'
import { styled } from 'styled-components'

export const CreateHabitsModalStyled = styled(ReactModal)`
  display: flex;
  flex-direction: column;
  width: 100%;
  max-width: 400px;
  max-height: 100vh;
  position: absolute;
  top: 35%;
  left: 50%;
  transform: translate(-50%, -50%);
  border-radius: 8px;
  background-color: var(--color1);
  padding: 10px;

  .container_modal_items {
    overflow-y: auto;
  }
  ::-webkit-scrollbar {
    width: 1px;
  }
  ::-webkit-scrollbar-thumb {
    border-radius: 3px;
  }

  .header {
    display: flex;
    justify-content: space-between;
  }

  form {
    display: flex;
    flex-direction: column;
    gap: 5px;
  }

  .weekDays {
    display: flex;
    align-items: center;
    gap: 5px;
  }

  .close_modal {
    display: flex;
    justify-content: space-between;
    padding: 10px;

    button {
      font-size: 20px;
      background-color: transparent;
      border: transparent;
      color: var(--grey4);
    }
  }
`
