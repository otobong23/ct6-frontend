import { ReactQRCode, ReactQRCodeProps } from '@lglab/react-qr-code'

const QR_codeGenerator = ({ value, size = 120 }: { value: string, size?: number }) => {
  const props: Omit<ReactQRCodeProps, 'value'> = {
    // frameSettings: {
    //   style: 'bubble',
    //   text: 'Follow us', 
    //   color: '#18181b'
    // },
    dataModulesSettings: { style: 'rounded', color: '#fff' },
    finderPatternOuterSettings: { style: 'rounded-lg', color: '#fff' },
    finderPatternInnerSettings: { style: 'rounded', color: '#00a3ab' },
  }
  return (
    <ReactQRCode
      value={value}
      {...props}
      marginSize={1}
      size={size}
    />
  )
}

export default QR_codeGenerator