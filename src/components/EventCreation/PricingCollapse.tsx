import { Form, Radio, InputNumber, Select, Typography } from "antd"
import { DollarOutlined, GiftOutlined } from "@ant-design/icons"
import { EVENT_TYPE } from "../../types"

const { Option } = Select
const { Text } = Typography

interface PricingCollapseProps {
  eventType: EVENT_TYPE
  setEventType: (type: EVENT_TYPE) => void
  formValues: any
}

export default function PricingCollapse({ eventType, setEventType, formValues }: PricingCollapseProps) {
  return (
    <div className="space-y-6">
      <div>
        <Text strong className="block mb-4">Event Type</Text>
        <Radio.Group 
          value={eventType} 
          onChange={(e) => setEventType(e.target.value)} 
          className="w-full"
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className={`border-2 rounded-lg p-4 transition-all cursor-pointer ${
              eventType === EVENT_TYPE.FREE ? 'border-green-500 bg-green-50' : 'border-gray-200 hover:border-gray-300'
            }`}>
              <Radio value={EVENT_TYPE.FREE} className="w-full">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                    <GiftOutlined className="text-green-600 text-lg" />
                  </div>
                  <div>
                    <Text strong className="block">Free Event</Text>
                    <Text type="secondary" className="text-sm">No charge for attendance</Text>
                  </div>
                </div>
              </Radio>
            </div>
            
            <div className={`border-2 rounded-lg p-4 transition-all cursor-pointer ${
              eventType === EVENT_TYPE.PAID ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-gray-300'
            }`}>
              <Radio value={EVENT_TYPE.PAID} className="w-full">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                    <DollarOutlined className="text-blue-600 text-lg" />
                  </div>
                  <div>
                    <Text strong className="block">Paid Event</Text>
                    <Text type="secondary" className="text-sm">Charge for tickets</Text>
                  </div>
                </div>
              </Radio>
            </div>
          </div>
        </Radio.Group>
      </div>

      {eventType === EVENT_TYPE.PAID && (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Form.Item 
              name="price" 
              label="Price ($)"
              rules={[{ required: true, message: "Price required" }]}
            >
              <InputNumber 
                className="w-full" 
                placeholder="25.00" 
                min={0} 
                size="large"
              />
            </Form.Item>
            
            <Form.Item name="capacity" label="Tickets Available">
              <InputNumber 
                className="w-full" 
                placeholder="100" 
                min={1} 
                size="large"
              />
            </Form.Item>
          </div>


        </>
      )}

      {eventType === EVENT_TYPE.FREE && (
        <Form.Item name="registrationLimit" label="Registration Limit">
          <InputNumber 
            className="w-full" 
            placeholder="Leave empty for unlimited" 
            min={1} 
            size="large"
          />
        </Form.Item>
      )}
    </div>
  )
}