import axios, { AxiosResponse } from 'axios';


interface User {
    id: number;
    firstName: string;
    lastName: string;    
    age: number;
    gender: string;    
    hair: {
        color: string;
    };
    address: {
        postalCode: string;
    };
    company: {
        department: string; 
    };
}

interface GroupedData {
    [department: string]: {
        male: number;
        female: number;
        ageRange: string;
        hair: { 
            [color: string]: number 
        };
        address: { 
            [name: string]: string 
        };
    };
}

const groupedData: GroupedData = {};

async function fetchData(): Promise<void> {
    const departMentApi: string = "https://dummyjson.com/users"
    try {
      const response: AxiosResponse = await axios.get(departMentApi);
      groupAllDataByDepartment(response.data.users)
      console.log(groupedData)
    } catch (error) {
      console.error('Error:', error);
    }
  }


// group department
const groupAllDataByDepartment = (data: User[]) => {
    data.forEach((user) => {
        let department = user.company.department
        let userGender = user.gender
        let userHairColor = user.hair.color
        let userFirstAndLastName = user.firstName + user.lastName
        let postalCode = user.address.postalCode
        let userAge = user.age

        // check have department
        if (!groupedData[department]) {        
            // create department obj
            groupedData[department] = {
                male: 0,
                female: 0,
                ageRange: '',
                hair: {},
                address: {},
            };
        }
                    
        let groupDepartment = groupedData[department];
        groupGender(groupDepartment, userGender);
        groupAgeRange(groupDepartment, userAge);
        groupHairColor(groupDepartment, userHairColor);
        groupPostalAndName(groupDepartment, userFirstAndLastName, postalCode);
    });
}

// gender
const groupGender = (department: any, gender: string) => {
        if(gender === 'male'){
            department.male++
        } else {
            department.female++
        }
}

// age range
const groupAgeRange = (department: any, userAge: any) => {
    if (!department.ageRange) {
            // person 1
        department.ageRange = `${userAge}`;
    } else {            
        if (!department.ageRange.includes('-')) {
            // person 2
            let startAge = parseInt(department.ageRange);
            let age = userAge;
            if (startAge < age) department.ageRange = `${startAge}-${age}`;
            if (startAge > age) department.ageRange = `${age}-${startAge}`;
        } else {
            // >= person 3
            const [minAge, maxAge] = department.ageRange.split('-').map(Number);
            if (userAge < minAge) department.ageRange = `${userAge}-${maxAge}`;
            if (userAge > maxAge) department.ageRange = `${minAge}-${userAge}`;
        }
    }
}

// hair color
const groupHairColor = (department: any, hairColor: string) => {
    if (!department.hair[hairColor]) {
        department.hair[hairColor] = 1;
    } else {
        department.hair[hairColor]++;
    }    
}

// address
const groupPostalAndName = (department: any, name: string, postalCode: string) => {
    if(!department.address[postalCode]) {
        department.address[name] = postalCode
    }         
}

fetchData();