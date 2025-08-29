import { Form, Input, Select, Radio, Row, Col, Typography } from "antd"
import { EVENT_FORMAT } from "../../types"

const { Option } = Select
const { Text } = Typography

interface LocationFormProps {
  eventFormat: EVENT_FORMAT
  setEventFormat: (format: EVENT_FORMAT) => void
}

export default function LocationForm({ eventFormat, setEventFormat }: LocationFormProps) {
  return (
    <div className="space-y-6">
      <div>
        <Text strong>Event Format</Text>
        <Radio.Group value={eventFormat} onChange={(e) => setEventFormat(e.target.value)} className="mt-2 w-full">
          <Radio.Button value={EVENT_FORMAT.PHYSICAL}>Physical</Radio.Button>
          <Radio.Button value={EVENT_FORMAT.VIRTUAL}>Virtual</Radio.Button>
          <Radio.Button value={EVENT_FORMAT.HYBRID}>Hybrid</Radio.Button>
        </Radio.Group>
      </div>

      {(eventFormat === EVENT_FORMAT.VIRTUAL || eventFormat === EVENT_FORMAT.HYBRID) && (
        <Form.Item
          name="virtualUrl"
          label="Virtual Meeting URL"
          rules={[{ required: eventFormat === EVENT_FORMAT.VIRTUAL, message: "Virtual URL is required" }]}
        >
          <Input placeholder="https://zoom.us/j/..." />
        </Form.Item>
      )}

      {(eventFormat === EVENT_FORMAT.PHYSICAL || eventFormat === EVENT_FORMAT.HYBRID) && (
        <div>
          <Text strong className="block mb-4">Physical Location</Text>
          
          <Row gutter={[16, 16]}>
            <Col xs={24} sm={12}>
              <Form.Item 
                name="address" 
                label="Address"
                rules={[{ required: eventFormat === EVENT_FORMAT.PHYSICAL, message: "Address is required" }]}
              >
                <Input placeholder="Street Address" />
              </Form.Item>
            </Col>
            <Col xs={24} sm={12}>
              <Form.Item 
                name="city" 
                label="City"
                rules={[{ required: eventFormat === EVENT_FORMAT.PHYSICAL, message: "City is required" }]}
              >
                <Input placeholder="City" />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={[16, 16]}>
            <Col xs={24} sm={12}>
              <Form.Item name="state" label="State/Province">
                <Input placeholder="State/Province" />
              </Form.Item>
            </Col>
            <Col xs={24} sm={12}>
              <Form.Item name="country" label="Country/Region">
                <Select placeholder="Select Country">
                  <Option value="US">United States</Option>
                  <Option value="CA">Canada</Option>
                  <Option value="UK">United Kingdom</Option>
                  <Option value="AU">Australia</Option>
                  <Option value="IN">India</Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>

          <Form.Item name="venue" label="Venue Name">
            <Input placeholder="Venue Name" />
          </Form.Item>
        </div>
      )}
    </div>
  )
}