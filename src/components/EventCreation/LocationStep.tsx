import { Form, Input, Select, Radio, Row, Col, Typography } from "antd"
import { EnvironmentOutlined, LinkOutlined, GlobalOutlined } from "@ant-design/icons"
import { EVENT_FORMAT } from "../../types"

const { Option } = Select
const { Text, Title } = Typography

interface LocationStepProps {
  eventFormat: EVENT_FORMAT
  setEventFormat: (format: EVENT_FORMAT) => void
}

export default function LocationStep({ eventFormat, setEventFormat }: LocationStepProps) {
  return (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <Title level={4}>Where will your event happen?</Title>
        <Text type="secondary">Choose how people will attend your event</Text>
      </div>

      <div>
        <Text strong className="block mb-4">Event Format</Text>
        <Radio.Group 
          value={eventFormat} 
          onChange={(e) => setEventFormat(e.target.value)} 
          className="w-full"
        >
          <div className="grid grid-cols-1 gap-4">
            <div className={`border-2 rounded-lg p-4 transition-colors ${
              eventFormat === EVENT_FORMAT.PHYSICAL ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-gray-300'
            }`}>
              <Radio value={EVENT_FORMAT.PHYSICAL}>
                <div className="flex items-center gap-3">
                  <EnvironmentOutlined className="text-green-600 text-lg" />
                  <div>
                    <Text strong>In-Person Event</Text>
                    <div className="text-sm text-gray-500">People attend at a physical location</div>
                  </div>
                </div>
              </Radio>
            </div>
            
            <div className={`border-2 rounded-lg p-4 transition-colors ${
              eventFormat === EVENT_FORMAT.VIRTUAL ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-gray-300'
            }`}>
              <Radio value={EVENT_FORMAT.VIRTUAL}>
                <div className="flex items-center gap-3">
                  <LinkOutlined className="text-purple-600 text-lg" />
                  <div>
                    <Text strong>Virtual Event</Text>
                    <div className="text-sm text-gray-500">Online meeting or livestream</div>
                  </div>
                </div>
              </Radio>
            </div>
            
            <div className={`border-2 rounded-lg p-4 transition-colors ${
              eventFormat === EVENT_FORMAT.HYBRID ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-gray-300'
            }`}>
              <Radio value={EVENT_FORMAT.HYBRID}>
                <div className="flex items-center gap-3">
                  <GlobalOutlined className="text-orange-600 text-lg" />
                  <div>
                    <Text strong>Hybrid Event</Text>
                    <div className="text-sm text-gray-500">Both in-person and virtual attendance</div>
                  </div>
                </div>
              </Radio>
            </div>
          </div>
        </Radio.Group>
      </div>

      {/* Virtual URL for Virtual/Hybrid */}
      {(eventFormat === EVENT_FORMAT.VIRTUAL || eventFormat === EVENT_FORMAT.HYBRID) && (
        <Form.Item
          name="virtualUrl"
          label={<Text strong>Meeting Link *</Text>}
          rules={[{ 
            required: eventFormat === EVENT_FORMAT.VIRTUAL, 
            message: "Meeting link is required for virtual events" 
          }]}
        >
          <Input 
            placeholder="https://zoom.us/j/..." 
            size="large"
            prefix={<LinkOutlined className="text-gray-400" />}
          />
        </Form.Item>
      )}

      {/* Physical Location for Physical/Hybrid */}
      {(eventFormat === EVENT_FORMAT.PHYSICAL || eventFormat === EVENT_FORMAT.HYBRID) && (
        <div className="space-y-4">
          <div className="flex items-center gap-2 mb-4">
            <EnvironmentOutlined className="text-blue-600" />
            <Text strong>Physical Location</Text>
          </div>
          
          <Row gutter={[16, 16]}>
            <Col xs={24} sm={12}>
              <Form.Item 
                name="address" 
                label="Street Address *"
                rules={[{ 
                  required: eventFormat === EVENT_FORMAT.PHYSICAL, 
                  message: "Address is required" 
                }]}
              >
                <Input placeholder="123 Main Street" size="large" />
              </Form.Item>
            </Col>
            <Col xs={24} sm={12}>
              <Form.Item 
                name="city" 
                label="City *"
                rules={[{ 
                  required: eventFormat === EVENT_FORMAT.PHYSICAL, 
                  message: "City is required" 
                }]}
              >
                <Input placeholder="New York" size="large" />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={[16, 16]}>
            <Col xs={24} sm={12}>
              <Form.Item name="state" label="State/Province">
                <Input placeholder="NY" size="large" />
              </Form.Item>
            </Col>
            <Col xs={24} sm={12}>
              <Form.Item name="country" label="Country">
                <Select placeholder="Select Country" size="large">
                  <Option value="US">United States</Option>
                  <Option value="CA">Canada</Option>
                  <Option value="UK">United Kingdom</Option>
                  <Option value="AU">Australia</Option>
                  <Option value="IN">India</Option>
                  <Option value="DE">Germany</Option>
                  <Option value="FR">France</Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>

          <Form.Item name="venue" label="Venue Name">
            <Input placeholder="Conference Center, Hotel, etc." size="large" />
          </Form.Item>
        </div>
      )}
    </div>
  )
}