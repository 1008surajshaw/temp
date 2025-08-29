import { Form, Switch, Select, InputNumber, Card, Typography, Input } from "antd"
import { useState } from "react"
import { SCHEDULE_MODE, RECURRENCE_PATTERN, REFUND_STRATEGY, DETAIL_VIEW_MODE, EVENT_TYPE } from "../../types"

const { Option } = Select
const { Text, Title } = Typography
const { TextArea } = Input

interface AdvancedStepProps {
  formValues: any
  eventType: EVENT_TYPE
}

export default function AdvancedStep({ formValues, eventType }: AdvancedStepProps) {
  const [enableScheduleMode, setEnableScheduleMode] = useState(false)
  const [enableRecurrence, setEnableRecurrence] = useState(false)
  const [enableRefundPolicy, setEnableRefundPolicy] = useState(false)
  const [enableAccessControl, setEnableAccessControl] = useState(false)
  const [enableTerms, setEnableTerms] = useState(false)

  return (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <Title level={4}>Fine-tune your event settings</Title>
        <Text type="secondary">Advanced options to customize your event experience</Text>
      </div>

      {/* Schedule Mode */}
      <Card size="small" className="border-l-4 border-l-blue-500">
        <div className="flex items-center justify-between mb-4">
          <div>
            <Text strong>Schedule Mode</Text>
            <div className="text-sm text-gray-500">Configure how your event is scheduled</div>
          </div>
          <Switch checked={enableScheduleMode} onChange={setEnableScheduleMode} />
        </div>
        
        {enableScheduleMode && (
          <Form.Item name="scheduleMode" label="Schedule Type">
            <Select placeholder="Select schedule mode" size="large">
              <Option value={SCHEDULE_MODE.SINGLE}>Single Event</Option>
              <Option value={SCHEDULE_MODE.MULTI}>Multi-day Event</Option>
              <Option value={SCHEDULE_MODE.RECURRING}>Recurring Event</Option>
            </Select>
          </Form.Item>
        )}
      </Card>

      {/* Recurrence Pattern */}
      <Card size="small" className="border-l-4 border-l-green-500">
        <div className="flex items-center justify-between mb-4">
          <div>
            <Text strong>Recurrence Pattern</Text>
            <div className="text-sm text-gray-500">Set up recurring events</div>
          </div>
          <Switch checked={enableRecurrence} onChange={setEnableRecurrence} />
        </div>
        
        {enableRecurrence && (
          <div className="space-y-4">
            <Form.Item name="recurrencePattern" label="Repeat Pattern">
              <Select placeholder="How often does this repeat?" size="large">
                <Option value={RECURRENCE_PATTERN.DAILY}>Daily</Option>
                <Option value={RECURRENCE_PATTERN.WEEKLY}>Weekly</Option>
                <Option value={RECURRENCE_PATTERN.MONTHLY}>Monthly</Option>
              </Select>
            </Form.Item>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Form.Item name="recurrenceInterval" label="Repeat Every">
                <InputNumber 
                  min={1} 
                  placeholder="1" 
                  className="w-full" 
                  size="large"
                  addonAfter={formValues.recurrencePattern === RECURRENCE_PATTERN.DAILY ? "day(s)" : 
                             formValues.recurrencePattern === RECURRENCE_PATTERN.WEEKLY ? "week(s)" : "month(s)"}
                />
              </Form.Item>
              
              <Form.Item name="maxOccurrences" label="Max Occurrences">
                <InputNumber 
                  min={1} 
                  placeholder="10" 
                  className="w-full" 
                  size="large"
                />
              </Form.Item>
            </div>
          </div>
        )}
      </Card>

      {/* Refund Policy (only for paid events) */}
      {eventType === EVENT_TYPE.PAID && (
        <Card size="small" className="border-l-4 border-l-orange-500">
          <div className="flex items-center justify-between mb-4">
            <div>
              <Text strong>Refund Policy</Text>
              <div className="text-sm text-gray-500">Configure cancellation and refunds</div>
            </div>
            <Switch checked={enableRefundPolicy} onChange={setEnableRefundPolicy} />
          </div>
          
          {enableRefundPolicy && (
            <div className="space-y-4">
              <Form.Item name="refundStrategy" label="Refund Policy">
                <Select placeholder="Select refund policy" size="large">
                  <Option value={REFUND_STRATEGY.FULL}>Full Refund</Option>
                  <Option value={REFUND_STRATEGY.PARTIAL}>Partial Refund</Option>
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
            </div>
          )}
        </Card>
      )}

      {/* Access Control */}
      <Card size="small" className="border-l-4 border-l-purple-500">
        <div className="flex items-center justify-between mb-4">
          <div>
            <Text strong>Access Control</Text>
            <div className="text-sm text-gray-500">Control who can see and join your event</div>
          </div>
          <Switch checked={enableAccessControl} onChange={setEnableAccessControl} />
        </div>
        
        {enableAccessControl && (
          <div className="space-y-4">
            <Form.Item name="requireRsvp" label="Require RSVP" valuePropName="checked">
              <Switch />
            </Form.Item>
            
            <Form.Item name="detailViewMode" label="Event Details Visibility">
              <Select placeholder="When can people see event details?" size="large">
                <Option value={DETAIL_VIEW_MODE.BEFORE}>Before Registration</Option>
                <Option value={DETAIL_VIEW_MODE.AFTER}>After Registration</Option>
                <Option value={DETAIL_VIEW_MODE.CUSTOM}>Custom</Option>
              </Select>
            </Form.Item>
          </div>
        )}
      </Card>

      {/* Terms and Conditions */}
      <Card size="small" className="border-l-4 border-l-red-500">
        <div className="flex items-center justify-between mb-4">
          <div>
            <Text strong>Terms & Conditions</Text>
            <div className="text-sm text-gray-500">Add legal terms for your event</div>
          </div>
          <Switch checked={enableTerms} onChange={setEnableTerms} />
        </div>
        
        {enableTerms && (
          <Form.Item name="termsAndConditions" label="Terms & Conditions">
            <TextArea 
              rows={4} 
              placeholder="Enter your terms and conditions here..."
              size="large"
            />
          </Form.Item>
        )}
      </Card>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <Text type="secondary" className="text-sm">
          💡 <strong>Tip:</strong> These advanced settings are optional. You can always update them later after creating your event.
        </Text>
      </div>
    </div>
  )
}