import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from '@bytesyze-ui/core/accordion'

export default function AccordionPage() {
  return (
    <Accordion type="single" defaultValue="item-1" className="w-full">
      <AccordionItem value="item-1">
        <AccordionTrigger value="item-1">Is it accessible?</AccordionTrigger>
        <AccordionContent value="item-1">
          Yes. It adheres to the WAI-ARIA design pattern.
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="item-2">
        <AccordionTrigger value="item-2">Is it styled?</AccordionTrigger>
        <AccordionContent value="item-2">
          Yes. It comes with default styles that match the neumorphic theme.
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  )
}
