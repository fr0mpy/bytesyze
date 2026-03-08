import { Alert, AlertTitle, AlertDescription } from '@bytesyze-ui/core/alert'

export default function AlertPage() {
  return (
    <div className="space-y-4">
      <Alert variant="info">
        <AlertTitle>Information</AlertTitle>
        <AlertDescription>This is an informational alert message.</AlertDescription>
      </Alert>
      <Alert variant="success">
        <AlertTitle>Success</AlertTitle>
        <AlertDescription>Your action was successful.</AlertDescription>
      </Alert>
      <Alert variant="warning">
        <AlertTitle>Warning</AlertTitle>
        <AlertDescription>Please review this warning.</AlertDescription>
      </Alert>
      <Alert variant="destructive">
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>An error has occurred.</AlertDescription>
      </Alert>
    </div>
  )
}
