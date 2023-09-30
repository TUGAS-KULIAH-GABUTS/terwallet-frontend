import { useState } from 'react'

interface DateTimePickerProps {
  title: string
  start: any
  end: any
  save: any
}

export default function DateTimePickerStyle({
  title,
  start,
  end,
  save
}: DateTimePickerProps) {
  const [showModal, setShowModal] = useState(false)

  const openModal = () => {
    setShowModal(!showModal)
  }

  const handleOnSave = () => {
    save()
    setShowModal(false)
  }

  return (
    <>
      <button
        className="bg-teal-500 text-white active:bg-teal-400 font-bold text-sm px-2 py-2 rounded shadow hover:shadow-lg outline-none focus:outline-none ease-linear transition-all duration-150"
        type="button"
        onClick={openModal}
      >
        {title}
      </button>
      {showModal ? (
        <>
          <div className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none">
            <div className="relative mt-10 mx-auto max-w-2xl">
              {/*content*/}
              <div className="border-0 rounded-lg shadow-lg relative flex flex-col w-96 h-56 bg-white outline-none focus:outline-none">
                {/*body*/}
                <div className="relative p-6 flex-auto">
                  <div className="flex items-center justify-between">
                    <div
                      className="datepicker relative form-floating xl:w-96"
                      data-mdb-toggle-button="false"
                    >
                      <p className="text-center text-gray-500">Start</p>
                      <input
                        type="date"
                        className="form-control block px-3 py-1.5 text-base font-normal text-gray-700 bg-white bg-clip-padding border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none"
                        placeholder="Select a date"
                        onChange={(e) => start(e.target.value)}
                      />
                    </div>
                    <div
                      className="datepicker relative form-floating xl:w-96"
                      data-mdb-toggle-button="false"
                    >
                      <p className="text-center text-gray-500">End</p>
                      <input
                        type="date"
                        className="form-control block px-3 py-1.5 text-base font-normal text-gray-700 bg-white bg-clip-padding border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none"
                        placeholder="Select a date"
                        onChange={(e) => end(e.target.value)}
                      />
                    </div>
                  </div>
                </div>
                {/*footer*/}
                <div className="flex items-center justify-end p-2 border-t border-solid border-slate-200 rounded-b">
                  <button
                    className="bg-transparent mx-2 hover:bg-teal-500 text-teal-700 font-semibold hover:text-white py-1 px-5 border border-teal-500 hover:border-transparent rounded"
                    type="button"
                    onClick={openModal}
                  >
                    Close
                  </button>
                  <button
                    className="bg-teal-500 mx-2 text-white font-semibold py-1 px-5 hover:bg-teal-400 rounded"
                    type="button"
                    onClick={handleOnSave}
                  >
                    Save
                  </button>
                </div>
              </div>
            </div>
          </div>
          <div className="opacity-5 fixed inset-0 z-40 bg-black"></div>
        </>
      ) : null}
    </>
  )
}
