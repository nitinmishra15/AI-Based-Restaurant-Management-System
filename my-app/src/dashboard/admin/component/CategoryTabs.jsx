import React, { useContext } from "react";
import { MenuContext } from "../../../app/providers/MenuContextApi/MenuProvider";


const CategoryTabs = ({
    selectedCategory,
    setSelectedCategory
}) => {


    const {
        categories
    } = useContext(MenuContext);



    return (

        <div className="flex gap-3 flex-wrap mb-6">


            {
                ["All", ...categories.map(x=>x.categoryName)]
                .map(category => (


                    <button

                        key={category}

                        onClick={() =>
                            setSelectedCategory(category)
                        }


                        className={

                            selectedCategory === category

                            ?

                            "px-4 py-2 rounded-lg bg-orange-500 text-white cursor-pointer"

                            :

                            "px-4 py-2 rounded-lg bg-gray-200 cursor-pointer"

                        }

                    >

                        {category}

                    </button>


                ))
            }



        </div>

    );

};


export default CategoryTabs;