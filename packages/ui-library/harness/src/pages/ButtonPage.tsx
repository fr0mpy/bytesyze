import {
  Plus,
  ArrowRight,
  Download,
  Send,
  Settings,
  Trash2,
  Heart,
  Star,
  Search,
  ChevronRight,
  Mail,
  Bell,
} from 'lucide-react'
import { Button, ButtonStyles } from '@bytesyze-ui/core/button'

export default function ButtonPage() {
  return (
    <div className="flex flex-col gap-8">
      {/* Variants */}
      <section>
        <h3 className="text-sm font-medium text-muted-foreground mb-3">Variants</h3>
        <div className="flex flex-wrap gap-4">
          <Button variant="primary">Primary</Button>
          <Button variant="secondary">Secondary</Button>
          <Button variant="text">Text</Button>
          <Button variant="ghost">Ghost</Button>
          <Button variant="destructive">Destructive</Button>
        </div>
      </section>

      {/* Sizes */}
      <section>
        <h3 className="text-sm font-medium text-muted-foreground mb-3">Sizes</h3>
        <div className="flex flex-wrap items-center gap-4">
          <Button size="sm">Small</Button>
          <Button size="md">Medium</Button>
          <Button size="lg">Large</Button>
        </div>
      </section>

      {/* Icons at Start */}
      <section>
        <h3 className="text-sm font-medium text-muted-foreground mb-3">Icon Start</h3>
        <div className="flex flex-wrap gap-4">
          <Button variant="primary">
            <Plus className={ButtonStyles.icon.md} />
            Create New
          </Button>
          <Button variant="secondary">
            <Download className={ButtonStyles.icon.md} />
            Download
          </Button>
          <Button variant="ghost">
            <Settings className={ButtonStyles.icon.md} />
            Settings
          </Button>
          <Button variant="destructive">
            <Trash2 className={ButtonStyles.icon.md} />
            Delete
          </Button>
        </div>
      </section>

      {/* Icons at End */}
      <section>
        <h3 className="text-sm font-medium text-muted-foreground mb-3">Icon End</h3>
        <div className="flex flex-wrap gap-4">
          <Button variant="primary">
            Continue
            <ArrowRight className={ButtonStyles.icon.md} />
          </Button>
          <Button variant="secondary">
            Send
            <Send className={ButtonStyles.icon.md} />
          </Button>
          <Button variant="ghost">
            View More
            <ChevronRight className={ButtonStyles.icon.md} />
          </Button>
        </div>
      </section>

      {/* Icon Only */}
      <section>
        <h3 className="text-sm font-medium text-muted-foreground mb-3">Icon Only</h3>
        <div className="flex flex-wrap items-center gap-4">
          <Button variant="primary" className={ButtonStyles.iconOnly.sm} aria-label="Add">
            <Plus className={ButtonStyles.icon.sm} />
          </Button>
          <Button variant="primary" className={ButtonStyles.iconOnly.md} aria-label="Add">
            <Plus className={ButtonStyles.icon.md} />
          </Button>
          <Button variant="primary" className={ButtonStyles.iconOnly.lg} aria-label="Add">
            <Plus className={ButtonStyles.icon.lg} />
          </Button>
        </div>
        <div className="flex flex-wrap items-center gap-4 mt-4">
          <Button variant="secondary" className={ButtonStyles.iconOnly.md} aria-label="Search">
            <Search className={ButtonStyles.icon.md} />
          </Button>
          <Button variant="ghost" className={ButtonStyles.iconOnly.md} aria-label="Settings">
            <Settings className={ButtonStyles.icon.md} />
          </Button>
          <Button variant="text" className={ButtonStyles.iconOnly.md} aria-label="Favorite">
            <Heart className={ButtonStyles.icon.md} />
          </Button>
          <Button variant="destructive" className={ButtonStyles.iconOnly.md} aria-label="Delete">
            <Trash2 className={ButtonStyles.icon.md} />
          </Button>
        </div>
      </section>

      {/* Combined Examples */}
      <section>
        <h3 className="text-sm font-medium text-muted-foreground mb-3">Combined Examples</h3>
        <div className="flex flex-wrap gap-4">
          <Button variant="primary" size="lg">
            <Mail className={ButtonStyles.icon.lg} />
            Send Message
            <ArrowRight className={ButtonStyles.icon.lg} />
          </Button>
          <Button variant="secondary" size="sm">
            <Star className={ButtonStyles.icon.sm} />
            Favorite
          </Button>
          <Button variant="ghost" size="md">
            <Bell className={ButtonStyles.icon.md} />
            Notifications
          </Button>
        </div>
      </section>

      {/* Loading State */}
      <section>
        <h3 className="text-sm font-medium text-muted-foreground mb-3">Loading</h3>
        <div className="flex flex-wrap gap-4">
          <Button loading>Loading</Button>
          <Button loading loadingText="Saving...">Save</Button>
        </div>
      </section>
    </div>
  )
}
