import { Button } from '@bytesyze-ui/core/button'
import { Paper, PaperHeader, PaperTitle, PaperDescription, PaperContent, PaperFooter } from '@bytesyze-ui/core/paper'

export default function PaperPage() {
  return (
    <div className="space-y-6">
      <div className="flex gap-6">
        <Paper className="w-full max-w-sm p-6">
          <p className="text-sm text-muted-foreground">
            Simple Paper with default depth. Content appears carved into the surface.
          </p>
        </Paper>
        <Paper depth="sm" className="w-full max-w-sm p-6">
          <p className="text-sm text-muted-foreground">
            Paper with subtle (sm) depth for lighter inset effect.
          </p>
        </Paper>
        <Paper depth="md" className="w-full max-w-sm p-6">
          <p className="text-sm text-muted-foreground">
            Paper with medium (md) depth for a deeper carved effect.
          </p>
        </Paper>
      </div>
      <Paper className="w-full max-w-md">
        <PaperHeader>
          <PaperTitle>Inward Neumorphic</PaperTitle>
          <PaperDescription>Content that appears carved into the surface.</PaperDescription>
        </PaperHeader>
        <PaperContent>
          <p className="text-sm text-muted-foreground">
            Paper uses inset shadows to create a concave effect, opposite of Card which appears raised.
          </p>
        </PaperContent>
        <PaperFooter>
          <Button variant="ghost" size="sm">Learn more</Button>
        </PaperFooter>
      </Paper>
    </div>
  )
}
