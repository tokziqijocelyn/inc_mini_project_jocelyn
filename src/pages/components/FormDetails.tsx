import React from 'react'

type Props = {
  email: string,
  password: string,
  handleEmailChange: (email: string, password: string) => Array<string>,
}

const FormDetails = (props: Props) => {
  return (
    <div>FormDetails</div>
  )
}

export default FormDetails