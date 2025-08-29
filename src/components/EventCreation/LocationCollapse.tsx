import { Form, Input, Select, Radio, Row, Col, Typography } from "antd"
import { EnvironmentOutlined, LinkOutlined, GlobalOutlined } from "@ant-design/icons"
import { EVENT_FORMAT } from "../../types"

const { Option } = Select
const { Text } = Typography

interface LocationCollapseProps {
  eventFormat: EVENT_FORMAT
  setEventFormat: (format: EVENT_FORMAT) => void
}

export default function LocationCollapse({ eventFormat, setEventFormat }: LocationCollapseProps) {
  return (
    <div className="space-y-6">
      <div>
        <Text strong className="block mb-4">Event Format</Text>
        <Radio.Group 
          value={eventFormat} 
          onChange={(e) => setEventFormat(e.target.value)} 
          className="w-full"
        >
          <div className="grid grid-cols-1 gap-4">
            <div className={`border-2 rounded-lg p-4 transition-all cursor-pointer ${
              eventFormat === EVENT_FORMAT.PHYSICAL ? 'border-green-500 bg-green-50' : 'border-gray-200 hover:border-gray-300'
            }`}>
              <Radio value={EVENT_FORMAT.PHYSICAL} className="w-full">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                    <EnvironmentOutlined className="text-green-600 text-lg" />
                  </div>
                  <div>
                    <Text strong className="block">Physical Event</Text>
                    <Text type="secondary" className="text-sm">In-person attendance at a venue</Text>
                  </div>
                </div>
              </Radio>
            </div>
            
            <div className={`border-2 rounded-lg p-4 transition-all cursor-pointer ${
              eventFormat === EVENT_FORMAT.VIRTUAL ? 'border-purple-500 bg-purple-50' : 'border-gray-200 hover:border-gray-300'
            }`}>
              <Radio value={EVENT_FORMAT.VIRTUAL} className="w-full">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                    <LinkOutlined className="text-purple-600 text-lg" />
                  </div>
                  <div>
                    <Text strong className="block">Virtual Event</Text>
                    <Text type="secondary" className="text-sm">Online meeting or livestream</Text>
                  </div>
                </div>
              </Radio>
            </div>
            
            <div className={`border-2 rounded-lg p-4 transition-all cursor-pointer ${
              eventFormat === EVENT_FORMAT.HYBRID ? 'border-orange-500 bg-orange-50' : 'border-gray-200 hover:border-gray-300'
            }`}>
              <Radio value={EVENT_FORMAT.HYBRID} className="w-full">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center">
                    <GlobalOutlined className="text-orange-600 text-lg" />
                  </div>
                  <div>
                    <Text strong className="block">Hybrid Event</Text>
                    <Text type="secondary" className="text-sm">Both in-person and virtual options</Text>
                  </div>
                </div>
              </Radio>
            </div>
          </div>
        </Radio.Group>
      </div>

      {(eventFormat === EVENT_FORMAT.VIRTUAL || eventFormat === EVENT_FORMAT.HYBRID) && (
        <Form.Item
          name="virtualUrl"
          label={<Text strong>Virtual Link *</Text>}
          rules={[{ 
            required: eventFormat === EVENT_FORMAT.VIRTUAL, 
            message: "Virtual link required" 
          }]}
        >
          <Input placeholder="https://zoom.us/j/..." size="large" />
        </Form.Item>
      )}

      {(eventFormat === EVENT_FORMAT.PHYSICAL || eventFormat === EVENT_FORMAT.HYBRID) && (
        <div className="space-y-4">
          <Text strong>Physical Location</Text>
          
          <Row gutter={[16, 16]}>
            <Col xs={24} sm={12}>
              <Form.Item 
                name="address" 
                label={<Text strong>Address *</Text>}
                rules={[{ 
                  required: eventFormat === EVENT_FORMAT.PHYSICAL, 
                  message: "Address required" 
                }]}
              >
                <Input placeholder="Street address" size="large" />
              </Form.Item>
            </Col>
            <Col xs={24} sm={12}>
              <Form.Item 
                name="city" 
                label={<Text strong>City *</Text>}
                rules={[{ 
                  required: eventFormat === EVENT_FORMAT.PHYSICAL, 
                  message: "City required" 
                }]}
              >
                <Input placeholder="City" size="large" />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={[16, 16]}>
            <Col xs={24} sm={12}>
              <Form.Item name="state" label="State">
                <Input placeholder="State" size="large" />
              </Form.Item>
            </Col>
            <Col xs={24} sm={12}>
              <Form.Item name="country" label="Country">
                <Select placeholder="Country" size="large">
                  <Option value="US">United States</Option>
                  <Option value="CA">Canada</Option>
                  <Option value="UK">United Kingdom</Option>
                  <Option value="IN">India</Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>

          <Form.Item name="venue" label="Venue Name">
            <Input placeholder="Venue name" size="large" />
          </Form.Item>
        </div>
      )}
    </div>
  )
}