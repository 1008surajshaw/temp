import { Form, Switch, Select, InputNumber, Typography, Divider, DatePicker, Button, Input } from "antd"
import { PlusOutlined, DeleteOutlined } from "@ant-design/icons"
import { useState, useEffect } from "react"
import { REFUND_STRATEGY } from "../../types"
import dayjs from "dayjs"

const { Option } = Select
const { Text } = Typography
const { TextArea } = Input

interface TieredRefund {
  before_date: Date
  percentage: number
}

interface CancellationPolicyCollapseProps {
  formValues: any
}

export default function CancellationPolicyCollapse({ formValues }: CancellationPolicyCollapseProps) {
  const [tieredRefunds, setTieredRefunds] = useState<TieredRefund[]>([])
  const [showTieredRefunds, setShowTieredRefunds] = useState(false)

  useEffect(() => {
    setShowTieredRefunds(formValues.refundStrategy === REFUND_STRATEGY.TIERED)
  }, [formValues.refundStrategy])

  const addTieredRefund = () => {
    const updated = [...tieredRefunds, { before_date: new Date(), percentage: 50 }]
    setTieredRefunds(updated)
    // Update form field
    const form = Form.useFormInstance()
    form.setFieldsValue({ tieredRefunds: updated })
  }

  const removeTieredRefund = (index: number) => {
    const updated = tieredRefunds.filter((_, i) => i !== index)
    setTieredRefunds(updated)
    // Update form field
    const form = Form.useFormInstance()
    form.setFieldsValue({ tieredRefunds: updated })
  }

  const updateTieredRefund = (index: number, field: keyof TieredRefund, value: any) => {
    const updated = [...tieredRefunds]
    updated[index] = { ...updated[index], [field]: value }
    setTieredRefunds(updated)
    // Update form field
    const form = Form.useFormInstance()
    form.setFieldsValue({ tieredRefunds: updated })
  }

  return (
    <div className="space-y-6">
      <div>
        <Text strong className="block mb-4">Cancellation Policy</Text>
        
        <Form.Item name="cancellationAllowed" label="Allow Cancellations" valuePropName="checked">
          <Switch />
        </Form.Item>
        
        {formValues.cancellationAllowed && (
          <div className="space-y-4 mt-4">
            <Form.Item name="refundStrategy" label="Refund Strategy">
              <Select placeholder="Select refund policy" size="large">
                <Option value={REFUND_STRATEGY.FULL}>Full Refund</Option>
                <Option value={REFUND_STRATEGY.PARTIAL}>Partial Refund</Option>
                <Option value={REFUND_STRATEGY.TIERED}>Tiered Refund</Option>
                <Option value={REFUND_STRATEGY.NONE}>No Refund</Option>
              </Select>
            </Form.Item>
            
            {formValues.refundStrategy === REFUND_STRATEGY.PARTIAL && (
              <Form.Item name="refundPercentage" label="Refund Percentage">
                <InputNumber
                  min={0}
                  max={100}
                  formatter={(value) => `${value}%`}
                  parser={(value) => parseInt(value!.replace("%", "")) as any}
                  className="w-full"
                  size="large"
                />
              </Form.Item>
            )}
            
            {showTieredRefunds && (
              <div>
                <Form.Item name="tieredRefunds" hidden>
                  <Input />
                </Form.Item>
                
                <div className="flex justify-between items-center mb-3">
                  <Text strong>Tiered Refund Schedule</Text>
                  <Button type="dashed" onClick={addTieredRefund} icon={<PlusOutlined />}>
                    Add Tier
                  </Button>
                </div>
                
                {tieredRefunds.map((_, index) => (
                  <div key={index} className="border border-gray-200 rounded-lg p-4 mb-3">
                    <div className="flex justify-between items-start mb-3">
                      <Text strong>Tier {index + 1}</Text>
                      <Button 
                        type="text" 
                        danger 
                        icon={<DeleteOutlined />}
                        onClick={() => removeTieredRefund(index)}
                      />
                    </div>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <Text className="block mb-2">Refund Before Date</Text>
                        <DatePicker 
                          className="w-full"
                          size="large"
                          format="MMM DD, YYYY"
                          disabledDate={(current) => {
                            const today = dayjs().startOf('day')
                            const eventDate = formValues.eventDate ? dayjs(formValues.eventDate).startOf('day') : null
                            return current && (current.isBefore(today) || (eventDate && current.isAfter(eventDate)))
                          }}
                          placeholder="Select cutoff date"
                          onChange={(date) => updateTieredRefund(index, 'before_date', date?.toDate())}
                        />
                      </div>
                      
                      <div>
                        <Text className="block mb-2">Refund Percentage</Text>
                        <InputNumber
                          min={0}
                          max={100}
                          size="large"
                          formatter={(value) => `${value}%`}
                          parser={(value) => parseInt(value!.replace("%", "")) as any}
                          className="w-full"
                          placeholder="50"
                          onChange={(value) => updateTieredRefund(index, 'percentage', value)}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
            
            <Form.Item name="cancellationPolicyText" label="Custom Cancellation Policy">
              <TextArea 
                rows={4} 
                placeholder="Describe your cancellation policy in detail..."
                size="large"
              />
            </Form.Item>
          </div>
        )}
      </div>

      <Divider />

      <Form.Item name="termsAndConditions" label="Terms & Conditions">
        <TextArea rows={3} placeholder="Terms and conditions (optional)" />
      </Form.Item>
    </div>
  )
}