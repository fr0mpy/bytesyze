import { Button } from '@bytesyze-ui/core/button'
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@bytesyze-ui/core/card'

export default function CardPage() {
  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>Card Title</CardTitle>
        <CardDescription>This is a card description with neumorphism.</CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground">
          Card content goes here. The neumorphic theme creates soft, tactile surfaces.
        </p>
      </CardContent>
      <CardFooter>
        <Button>Action</Button>
      </CardFooter>
    </Card>
  )
}
