interface IDescriptionList {
  data: any
  title?: string
  info?: string
}

export const DescriptionList = ({ data, title, info }: IDescriptionList) => {
  return (
    <div className="bg-white">
      <div>
        {title ? (
          <h3 className="text-lg leading-6 font-medium text-gray-900">{title}</h3>
        ) : (
          ''
        )}
        {info ? <p className="mt-1 max-w-2xl text-sm text-gray-500">{info}</p> : ''}
      </div>
      <div className="mt-2 border-t border-gray-200">
        <dl className="sm:divide-y sm:divide-gray-200">
          {data.map((value: any, index: number) => (
            <div key={index} className="py-2 sm:py-3 sm:grid sm:grid-cols-3 sm:gap-4">
              <dt className="text-sm font-medium text-gray-500">{value.label}</dt>
              {typeof value.value == 'function' ? (
                value.value()
              ) : (
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                  {value.value}
                </dd>
              )}
            </div>
          ))}
        </dl>
      </div>
    </div>
  )
}
