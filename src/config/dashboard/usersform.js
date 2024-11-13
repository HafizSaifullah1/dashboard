import React from 'react'
import ABScreenHeader from '../../component/ABScreenHeader'
import ABButton from '../../component/ABButton'
import { Input, } from 'antd'
function Usersform() {
    return (
        <>
            <div className='p-2' >
                <ABScreenHeader
                    title='UsersForm'
                    actionButton={[
                        {
                            display: () => <ABButton  label='save' />
                        }
                    ]}
                />
            </div>

            <div className="max-w-md mx-auto p-6 bg-white shadow-lg rounded-lg">
                <h2 className="text-2xl font-semibold mb-6 text-center">User Information</h2>

                {/* Name Field */}
                <div className="mb-4">
                    <label className="block text-gray-700 mb-2">Name</label>
                    <Input placeholder="Enter your name" className="w-full p-2 border rounded" />
                </div>

                {/* Email Field */}
                <div className="mb-4">
                    <label className="block text-gray-700 mb-2">Email</label>
                    <Input type="email" placeholder="Enter your email" className="w-full p-2 border rounded" />
                </div>

                {/* Phone Number Field */}
                <div className="mb-4">
                    <label className="block text-gray-700 mb-2">Phone Number</label>
                    <Input type="tel" placeholder="Enter your phone number" className="w-full p-2 border rounded" />
                </div>

                {/* Website Field */}
                <div className="mb-6">
                    <label className="block text-gray-700 mb-2">Website</label>
                    <Input type="url" placeholder="Enter your website" className="w-full p-2 border rounded" />
                </div>

                {/* Submit Button */}
                <ABButton  className="w-full" htmlType="submit"
                  label='save'
                />
            </div>

        </>
    )
}

export default Usersform