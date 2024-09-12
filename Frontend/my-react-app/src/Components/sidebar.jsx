const Sidebar = () => {
    return (
      <aside className="bg-gray-200 w-full sm:w-64 p-4">
        <ul className="flex sm:flex-col">
          <li className="mb-4 sm:mb-0 sm:mb-4 flex-1 sm:flex-none">
            <a href="#tab1" className="text-blue-500 hover:text-blue-700 hover:bg-gray-300 p-2 rounded">Tab 1</a>
          </li>
          <li className="mb-4 sm:mb-0 sm:mb-4 flex-1 sm:flex-none">
            <a href="#tab2" className="text-blue-500 hover:text-blue-700 hover:bg-gray-300 p-2 rounded">Tab 2</a>
          </li>
          <li className="mb-4 sm:mb-0 sm:mb-4 flex-1 sm:flex-none">
            <a href="#tab3" className="text-blue-500 hover:text-blue-700 hover:bg-gray-300 p-2 rounded">Tab 3</a>
          </li>
        </ul>
      </aside>
    );
  };
  
  export default Sidebar;